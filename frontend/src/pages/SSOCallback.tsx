import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export default function SSOCallback() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const retryCount = useRef(0);

  useEffect(() => {
    const syncWithBackend = async () => {
      if (!isLoaded || !user) {
        // Retry up to 10 times, every 500ms
        if (retryCount.current < 10) {
          retryCount.current += 1;
          setTimeout(syncWithBackend, 500);
        } else {
          toast.error("Failed to load user info from Google. Please try again.");
          navigate("/login");
        }
        return;
      }

      try {
        const token = await getToken(); // Clerk JWT token

        const userPayload = {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
          image: user.imageUrl,
          provider: user.externalAccounts?.[0]?.provider || "google",
        };

        await axios.post("/api/auth/sync", userPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        navigate("/dashboard");
      } catch (err) {
        console.error("Failed to sync with backend", err);
        toast.error("Failed to sign in. Please try again.");
        navigate("/login");
      }
    };

    syncWithBackend();
  }, [isLoaded, user, getToken, navigate]);

  return <p className="text-center p-4">Signing you in...</p>;
} 