import { Calendar, Eye, EyeOff } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { signupSchema } from "../schemas/validations";
import { toast } from "sonner";
import { useSignUp, useAuth } from "@clerk/clerk-react";
import axiosInstance from "../hooks/axiosInstance";
import axios, { AxiosError } from "axios";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const Signup = () => {
  const { signUp } = useSignUp();
  const { getToken } = useAuth();
  const [showOtp, setShowOtp] = useState(false);
  const [dob, setDob] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendOtp = async () => {
    const formData = {
      name,
      email,
      dob,
      otp,
    };
    const validation = signupSchema.safeParse(formData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }
    try {
      // First create the sign-up with a temporary password
      await signUp!.create({
        emailAddress: email,
        password: `TempPass${Date.now()}!`, // Temporary password that meets requirements
      });

      // Then prepare email verification (send OTP)
      await signUp!.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setShowOtpField(true);
      toast.success("OTP sent to your email");
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      toast.error(error.errors?.[0]?.message || "Failed to send OTP");
      console.log(err);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      // Verify the OTP and complete signup
      const result = await signUp!.attemptEmailAddressVerification({
        code: otp,
      });

      console.log(result);
      
      // Check if signup was successful and session was created
      if (result.status === "complete" && result.createdSessionId) {
        // Wait a moment for Clerk to update auth state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get the session token after successful signup
        const sessionToken = await getToken();
        
        // Get user ID from result or extract from token
        let userIdToUse = result.createdUserId || signUp!.createdUserId;
        
        if (!userIdToUse && sessionToken) {
          try {
            const tokenPayload = JSON.parse(atob(sessionToken.split('.')[1]));
            userIdToUse = tokenPayload?.sub;
          } catch (error) {
            console.error("Could not extract user ID from token:", error);
          }
        }
        
        if (!userIdToUse) {
          toast.error("Failed to get user information. Please try again.");
          return;
        }
        
        const userData = {
          user_id: userIdToUse,
          email: result.emailAddress || signUp!.emailAddress,
          dob,
          name,
          authProvider: 'email',
          sessionToken, // Include session token
        };
        
        console.log(userData);
        
        // Send data to backend to create user and store session
        const response = await axiosInstance.post(
          "/user/create",
          userData,
        );

        if (response.status === 200 || response.status === 201) {
          // Store session token in localStorage for future requests
          if (sessionToken) {
            localStorage.setItem('clerk_session_token', sessionToken);
          }
          
          toast.success("Sign up successful! User created.");
          // Redirect to dashboard or protected route
          window.location.href = "/dashboard";
        } else {
          toast.error("Failed to create user in database");
        }
      } else {
        toast.error("Signup verification failed");
      }
    } catch (err: unknown) {
      // Handle Clerk errors
      if (err && typeof err === "object" && "errors" in err) {
        const clerkError = err as { errors?: Array<{ message: string }> };
        toast.error(clerkError.errors?.[0]?.message || "Failed to verify OTP");
      }
      // Handle axios/backend errors
      else if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        toast.error(
          (axiosError.response?.data as any)?.message || "Failed to create user in backend",
        );
      }
      // Handle other errors
      else {
        toast.error("An unexpected error occurred");
      }
      console.log(err);
    }
  };

  return (
    <main className="px-5 md:flex md:justify-between md:items-center md:relative md:px-0 md:gap-10 md:h-screen">
      <div className="md:w-1/2 md:px-16">
        <div className="flex justify-center mt-7 md:absolute md:top-0 md:left-7">
          <img src="/logo.png" alt="logo" />
        </div>
        <h1 className="mt-5 text-4xl font-bold text-center md:text-left">
          Sign up
        </h1>
        <p className="text-center text-[#969696] mt-3 md:text-left">
          Sign up to enjoy the feature of HD
        </p>

        <div className="flex flex-col gap-6 mt-10">
          <div className="relative">
            <label
              className="absolute -top-3 bg-white left-3 text-sm text-[#969696]"
              htmlFor="name"
            >
              Your Name
            </label>
            <input
              className="w-full border border-[#969696] text-lg text-black rounded-md p-3 focus:border-blue-500"
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="relative">
            <label
              className="absolute -top-3 z-10 bg-white left-3 text-sm text-[#969696]"
              htmlFor="dob"
            >
              Date of Birth
            </label>
            <div
              className="flex items-center border border-[#969696] rounded-md p-3 w-full focus-within:border-blue-500 bg-white relative cursor-pointer"
              onClick={() => inputRef.current?.showPicker()}
              tabIndex={0}
              role="button"
              aria-label="Pick date of birth"
            >
              <span className="z-20 mr-1 black">
                <Calendar size={22} />
              </span>
              <input
                ref={inputRef}
                className="absolute top-0 left-0 z-30 w-full h-full opacity-0 cursor-pointer"
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                tabIndex={-1}
                aria-label="Date of Birth"
                style={{
                  MozAppearance: "textfield",
                }}
              />
              <span className="z-10 ml-2 text-lg text-black pointer-events-none select-none">
                {dob ? (
                  formatDate(dob)
                ) : (
                  <span className="text-[#969696]">DD/MM/YYYY</span>
                )}
              </span>
            </div>
          </div>

          <div className="relative">
            <label
              className="absolute -top-3 bg-white left-3 text-sm text-[#969696]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full border border-[#969696] text-lg text-black rounded-md p-3 focus:border-blue-500"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {showOtpField && (
            <div className="relative">
              <input
                className="w-full border border-[#969696] text-lg text-black rounded-md p-3 focus:border-blue-500"
                type={showOtp ? "text" : "password"}
                id="otp"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowOtp(!showOtp)}
              >
                {showOtp ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          )}

          <button
            onClick={showOtpField ? handleVerifyOtp : handleSendOtp}
            className="p-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
          >
            {showOtpField ? "Sign up" : "Send OTP"}
          </button>
        </div>
        <p className="text-center text-[#969696] mt-3">
          Already have an account?{" "}
          <Link
            className="font-semibold text-blue-500 hover:underline"
            to="/login"
          >
            Login
          </Link>
        </p>
      </div>
      <div className="hidden overflow-hidden py-3 w-1/2 rounded-lg md:block md:h-screen">
        <img
          src="/container.png"
          className="object-cover w-full h-full rounded-lg"
          alt="container"
        />
      </div>
    </main>
  );
};

export default Signup;
