import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import axiosInstance from "../hooks/axiosInstance";

const SSOCallback = () => {
  const { getToken, userId, isSignedIn, isLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (hasProcessedRef.current) return;
  
    if (!isLoaded || !isUserLoaded) {
      console.log("Clerk not ready");
      return;
    }
  
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("__clerk_handshake")) {
      console.log("Handshake in progress...");
      return;
    }
  
    // Lock execution before any async/redirect
    hasProcessedRef.current = true;
  
    const handleOAuthCallback = async () => {
      if (!isSignedIn || !userId || !user) {
        console.log("Not signed in after handshake, redirecting to login");
        toast.error("Authentication failed. Please try again.");
        navigate("/login", { replace: true });
        return;
      }
  
      try {
        setIsProcessing(true);
  
        const sessionToken = await getToken();
        if (!sessionToken) {
          toast.error("Session token missing");
          navigate("/login", { replace: true });
          return;
        }
  
        const userData = {
          user_id: user.id,
          email: user.emailAddresses?.[0]?.emailAddress || "",
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "",
          image: user.imageUrl || "",
          authProvider: "google",
          sessionToken,
        };
  
        console.log("Syncing with backend:", userData);
  
        const res = await axiosInstance.post("/user/create", userData);
  
        if (res.data.success) {
          localStorage.setItem("clerk_session_token", sessionToken);
          window.history.replaceState({}, document.title, window.location.pathname);
          toast.success("Signed in!");
          navigate("/dashboard", { replace: true });
        } else {
          toast.error("Backend failed to create user.");
          navigate("/login", { replace: true });
        }
      } catch (err: any) {
        console.error("Error syncing with backend", err);
        toast.error("Something went wrong. Please try again.");
        navigate("/login", { replace: true });
      } finally {
        setIsProcessing(false);
      }
    };
  
    handleOAuthCallback();
  }, [isLoaded, isUserLoaded, isSignedIn, userId, user, getToken, navigate]);
  

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