import { Calendar, Eye, EyeOff } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { signupSchema } from "../schemas/validations";
import { toast } from "sonner";
import { supabase } from "../../lib/supbaseBaseClient";

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
  const [showOtp, setShowOtp] = useState(false);
  const [dob, setDob] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSignup = async () => {
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
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("OTP sent to your email");
  };

  return (
    <main className="px-5 md:flex md:justify-between md:items-center md:relative md:px-0 md:gap-10 md:h-screen">
      <div className="md:w-1/2 md:px-16">
        <div className="flex justify-center mt-7 md:absolute md:top-0 md:left-7">
          <img src="/logo.png" alt="logo" />
        </div>
        <h1 className="text-4xl font-bold text-center mt-5 md:text-left">
          Sign up
        </h1>
        <p className="text-center text-[#969696] mt-3 md:text-left">
          Sign up to enjoy the feature of HD
        </p>

        <div className="mt-10 flex flex-col gap-6">
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
            <div className="flex items-center border border-[#969696] rounded-md p-3 w-full focus-within:border-blue-500 bg-white relative">
              <button
                type="button"
                className="mr-1 focus:outline-none z-20"
                onClick={() => inputRef.current?.showPicker()}
                tabIndex={-1}
                style={{ background: "transparent" }}
              >
                <Calendar size={22} />
              </button>
              <input
                ref={inputRef}
                className="flex-1 text-lg text-black outline-none border-none bg-transparent appearance-none pl-8
                  [&::-webkit-calendar-picker-indicator]:opacity-0
                  [&::-webkit-calendar-picker-indicator]:pointer-events-none
                  [&::-webkit-inner-spin-button]:appearance-none
                  [&::-webkit-clear-button]:appearance-none"
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                style={{
                  MozAppearance: "textfield",
                }}
              />
              <span className="absolute left-10 text-lg text-black pointer-events-none select-none z-10">
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
          <button
            onClick={handleSignup}
            className="bg-blue-500 text-white p-3 rounded-md"
          >
            Sign up
          </button>
        </div>
        <p className="text-center text-[#969696] mt-3">
          Already have an account?{" "}
          <Link
            className="text-blue-500 font-semibold hover:underline"
            to="/login"
          >
            Login
          </Link>
        </p>
      </div>
      <div className="hidden md:block md:h-screen w-1/2 py-3 rounded-lg overflow-hidden">
        <img
          src="/container.png"
          className="w-full h-full object-cover rounded-lg"
          alt="container"
        />
      </div>
    </main>
  );
};

export default Signup;
