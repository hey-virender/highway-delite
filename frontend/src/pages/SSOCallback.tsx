import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import axiosInstance from "../hooks/axiosInstance";
import axios from "axios";

const SSOCallback = () => {
  const { getToken, userId, isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log("SSO Callback - Auth state:", { isLoaded, isSignedIn, userId });

      // Wait for Clerk to be fully loaded
      if (!isLoaded) {
        console.log("Clerk not loaded yet, waiting...");
        return;
      }

      // If not signed in, redirect to login with error
      if (!isSignedIn || !userId) {
        console.log("Not signed in, redirecting to login");
        toast.error("Authentication failed. Please try again.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        console.log("Processing OAuth callback for user:", userId);
        setIsProcessing(true);

        // Get the session token
        const sessionToken = await getToken();
        
        if (!sessionToken) {
          toast.error("Failed to get session token");
          navigate("/login", { replace: true });
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
        console.log("Clerk user:", clerkUser);
        
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
          // Store session token
          if (sessionToken) {
            localStorage.setItem("clerk_session_token", sessionToken);
          }
          
          toast.success("Successfully signed in with Google!");
          navigate("/dashboard", { replace: true });
        } else {
          toast.error(response.data.message || "Failed to sign in");
          navigate("/login", { replace: true });
        }
      } catch (err: any) {
        console.error("SSO Callback Error:", err);
        
        if (err.response?.status === 401) {
          toast.error("Authentication failed. Please try again.");
        } else {
          toast.error(err.response?.data?.message || "Failed to sign in with Google");
        }
        
        navigate("/login", { replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    // Small delay to ensure Clerk state is fully updated
    const timer = setTimeout(handleOAuthCallback, 500);
    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn, userId, getToken, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing sign in...
            </h2>
            <p className="text-gray-600">
              Please wait while we set up your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-4">
            Something went wrong during the sign-in process.
          </p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SSOCallback; 