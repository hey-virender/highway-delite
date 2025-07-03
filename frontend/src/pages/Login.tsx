import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn, useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import axiosInstance from "../hooks/axiosInstance";
import axios, { AxiosError } from "axios";

const Login = () => {
  const { signIn } = useSignIn();
  const { getToken, userId, isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasHandledOAuth, setHasHandledOAuth] = useState(false);
  const retryCount = useRef(0);

  // Error states for each field
  const [errors, setErrors] = useState({
    email: "",
    otp: ""
  });

  // Email validation function
  const validateEmail = (email: string): string => {
    if (!email) {
      return "Please enter your email";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Clear error for specific field when user starts typing
  const clearFieldError = (fieldName: keyof typeof errors) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: "" }));
    }
  };

  // Robust Google OAuth handler using Clerk's backend API
  useEffect(() => {
    const handleGoogleOAuth = async () => {
      // Check if this is an OAuth callback (multiple possible parameters)
      const urlParams = new URLSearchParams(window.location.search);
      const isOAuthCallback = urlParams.has("code") || 
                             urlParams.has("__clerk_status") || 
                             urlParams.has("__clerk_handshake");
      
      if (!isLoaded || hasHandledOAuth || !isOAuthCallback) {
        return;
      }

      // If we're in OAuth flow but not signed in yet, wait and retry
      if (!isSignedIn || !userId) {
        if (retryCount.current < 20) {
          retryCount.current += 1;
          setTimeout(() => {
            // This will trigger the effect again
          }, 500);
        } else {
          toast.error("OAuth authentication timed out. Please try again.");
        }
        return;
      }

      console.log("Handling Google OAuth with userId:", userId);
      setHasHandledOAuth(true);
      setIsLoading(true);

      try {
        const sessionToken = await getToken();
        
        if (!sessionToken) {
          toast.error("Failed to get session token");
          setIsLoading(false);
          return;
        }

        // Fetch user data from Clerk's backend API
        const userResponse = await axios.get(`https://api.clerk.com/v1/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        });

        const clerkUser = userResponse.data;
        
        const userData = {
          user_id: clerkUser.id,
          email: clerkUser.email_addresses?.[0]?.email_address || "",
          name: `${clerkUser.first_name || ""} ${clerkUser.last_name || ""}`.trim() || clerkUser.username || "",
          image: clerkUser.image_url || "",
          authProvider: "google",
          sessionToken,
        };

        console.log("Sending user data to backend:", userData);
        
        const response = await axiosInstance.post("/user/create", userData);
        
        if (response.data.success) {
          if (sessionToken) {
            localStorage.setItem("clerk_session_token", sessionToken);
          }
          toast.success("Successfully signed in with Google!");
          // Clean up URL params and navigate
          window.history.replaceState({}, document.title, window.location.pathname);
          // Small delay to ensure state is updated
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 100);
        } else {
          toast.error(response.data.message || "Failed to sign in");
        }
      } catch (err: any) {
        console.error("Google OAuth Error:", err);
        if (err.response?.status === 401) {
          toast.error("Authentication failed. Please try again.");
        } else {
          toast.error(err.response?.data?.message || "Failed to sign in with Google");
        }
      } finally {
        setIsLoading(false);
      }
    };

    handleGoogleOAuth();
  }, [isLoaded, isSignedIn, userId, getToken, navigate, hasHandledOAuth]);

  const handleSendOtp = async () => {
    // Clear previous errors
    setErrors({ email: "", otp: "" });
    
    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors(prev => ({ ...prev, email: emailError }));
      toast.error(emailError);
      return;
    }
    setIsLoading(true);
    try {
      // Attempt to sign in with email
      const signInAttempt = await signIn!.create({
        identifier: email,
      });
      // Prepare email verification (send OTP)
      const emailAddress = signInAttempt.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      );
      if (emailAddress && emailAddress.strategy === "email_code") {
        await signIn!.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailAddress.emailAddressId,
        });
        setShowOtpField(true);
        toast.success("OTP sent to your email");
      } else {
        toast.error("Email verification not supported for this account");
      }
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      toast.error(error.errors?.[0]?.message || "Failed to send OTP");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    // Clear OTP error
    setErrors(prev => ({ ...prev, otp: "" }));
    
    if (!otp) {
      setErrors(prev => ({ ...prev, otp: "Please enter the OTP" }));
      toast.error("Please enter the OTP");
      return;
    }
    
    if (otp.length < 4) {
      setErrors(prev => ({ ...prev, otp: "OTP must be at least 4 characters" }));
      toast.error("Please enter a valid OTP");
      return;
    }
    setIsLoading(true);
    try {
      // Verify the OTP and complete sign in
      const result = await signIn!.attemptFirstFactor({
        strategy: "email_code",
        code: otp,
      });
      // Check if sign in was successful and session was created
      if (result.status === "complete" && result.createdSessionId) {
        // Wait a moment for Clerk to update auth state
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Get the session token after successful login
        const sessionToken = await getToken();
        // Get user ID from the sign-in result or auth hook
        let userIdToUse = userId;
        // If userId from hook is not available, try to get it from the session
        if (!userIdToUse) {
          try {
            // Force refresh the auth state
            await new Promise(resolve => setTimeout(resolve, 500));
            const tokenPayload = sessionToken ? JSON.parse(atob(sessionToken.split('.')[1])) : null;
            userIdToUse = tokenPayload?.sub;
          } catch (error) {
            console.error("Could not extract user ID from token:", error);
          }
        }
        if (!userIdToUse) {
          toast.error("Failed to get user information. Please try refreshing the page.");
          return;
        }
        // Send session data to backend to update user session
        const response = await axiosInstance.post("/user/login", {
          user_id: userIdToUse,
          sessionToken,
        });
        if (response.status === 200) {
          // Store session token in localStorage for future requests
          if (sessionToken) {
            localStorage.setItem("clerk_session_token", sessionToken);
          }
          toast.success("Login successful!");
          // Redirect to dashboard or protected route
          navigate("/dashboard");
        } else {
          toast.error("Failed to update session in database");
        }
      } else {
        toast.error("Login verification failed");
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
          (axiosError.response?.data as any)?.message || "Failed to login",
        );
      }
      // Handle other errors
      else {
        toast.error("An unexpected error occurred");
      }
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn!.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.origin + "/login",
        redirectUrlComplete: window.location.origin + "/dashboard", // Back to dashboard - now handled properly
      });
      
      setIsLoading(false);  
    } catch (err: unknown) {
      console.error("Google sign-in error:", err);
      const error = err as { errors?: Array<{ message: string }> };
      toast.error(error.errors?.[0]?.message || "Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <main className="px-5 md:flex md:justify-between md:items-center md:relative md:px-0 md:gap-10 md:h-screen">
      <div className="md:w-1/2 md:px-16">
        <div className="mt-7 md:absolute md:top-0 md:left-7">
          <img src="/logo.png" alt="logo" />
        </div>
        <h1 className="text-4xl font-bold text-center mt-5 md:text-left">Login</h1>
        <p className="text-center text-[#969696] mt-3 md:text-left">
          Login to enjoy the feature of HD
        </p>
        <div className="mt-10 flex flex-col gap-6">
          <div className="relative">
            <label
              className="absolute -top-3 bg-white left-3 text-sm text-[#969696]"
              htmlFor="name"
            >
              Email
            </label>
            <input
              className={`w-full border text-lg text-black rounded-md p-3 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-[#969696]'
              }`}
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError('email');
              }}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {showOtpField && (
            <div className="relative">
              <input
                className={`w-full border text-lg text-black rounded-md p-3 focus:border-blue-500 ${
                  errors.otp ? 'border-red-500' : 'border-[#969696]'
                }`}
                type={showOtp ? "text" : "password"}
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  clearFieldError('otp');
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowOtp(!showOtp)}
              >
                {showOtp ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
            </div>
          )}
          <button
            onClick={showOtpField ? handleVerifyOtp : handleSendOtp}
            disabled={isLoading}
            className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading 
              ? "Loading..." 
              : showOtpField 
              ? "Verify & Login" 
              : "Send OTP"
            }
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="text-gray-700 font-medium">Signing in...</span>
              </div>
            ) : (
              <>
                <img 
                  src="/google.png" 
                  alt="Google" 
                  className="w-5 h-5"
                />
                <span className="text-gray-700 font-medium">
                  Continue with Google
                </span>
              </>
            )}
          </button>
          <p className="text-center text-[#969696]">You need to sign up first to use Google Auth</p>
        </div>
        <p className="text-center text-[#969696] mt-3">
          Don&apos;t have an account?{" "}
          <Link
            className="text-blue-500 font-semibold hover:underline"
            to="/signup"
          >
            Sign up
          </Link>
        </p>
      </div>
      <div className="hidden md:block md:h-screen w-1/2 py-4" >
        <img src="/container.png" alt="container" className="h-full w-full object-cover rounded-lg" />
      </div>
    </main>
  );
};

export default Login;
