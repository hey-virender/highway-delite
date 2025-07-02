import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [showOtp, setShowOtp] = useState(false);
  return (
    <main className="px-5 md:flex md:justify-between md:items-center md:relative md:px-0 md:gap-10 md:h-screen">
      <div className="md:w-1/2 md:px-16">
        <div className="mt-7 lg:absolute lg:top-0 lg:left-7">
          <img src="/logo.png" alt="logo" />
        </div>
        <h1 className="text-4xl font-bold text-center mt-5 lg:text-left">Login</h1>
        <p className="text-center text-[#969696] mt-3 lg:text-left">
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
              className="w-full border border-[#969696] text-lg text-black rounded-md p-3 focus:border-blue-500"
              type="text"
              id="name"
              placeholder="Enter your email"
            />
          </div>

          <div className="relative">
            <input
              className="w-full border border-[#969696] text-lg text-black rounded-md p-3 focus:border-blue-500"
              type={showOtp ? "text" : "password"}
              id="otp"
              placeholder="OTP"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setShowOtp(!showOtp)}
            >
              {showOtp ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
          <button className="bg-blue-500 text-white p-3 rounded-md">
            Login
          </button>
        </div>
        <p className="text-center text-[#969696] mt-3">
          Don&apos;t have an account?{" "}
          <Link
            className="text-blue-500 font-semibold hover:underline"
            to="/login"
          >
            Sign up
          </Link>
        </p>
      </div>
      <div className="hidden md:block md:h-screen w-1/2 py-3" >
        <img src="/container.png" alt="container" />
      </div>
    </main>
  );
};

export default Login;
