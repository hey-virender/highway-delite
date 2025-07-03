import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { toast } from "sonner";

export default function OAuthCallback() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const clerk = useClerk();

  useEffect(() => {
    const handleCallback = async () => {
      if (!isLoaded) return;

      try {
        // Handle the OAuth handshake
        if (clerk && typeof clerk.handleRedirectCallback === 'function') {
          await clerk.handleRedirectCallback();
        }
        
        // Wait a moment for authentication to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (isSignedIn) {
          // Clean up URL and redirect to login to complete the process
          navigate("/login", { replace: true });
        } else {
          toast.error("OAuth authentication failed. Please try again.");
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        toast.error("Authentication failed. Please try again.");
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [isLoaded, isSignedIn, navigate, clerk]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
} 