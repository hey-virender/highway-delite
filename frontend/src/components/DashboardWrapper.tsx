import { useLocation } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import OAuthCallback from "./OAuthCallback";
import ProtectedRoute from "./ProtectedRoute";

export default function DashboardWrapper() {
  const location = useLocation();
  
  // Check if this is an OAuth callback with handshake parameters
  const searchParams = new URLSearchParams(location.search);
  const hasHandshakeParam = searchParams.has("__clerk_handshake") || 
                           searchParams.has("__clerk_status") ||
                           searchParams.has("code");

  // If this is an OAuth callback, handle it specially
  if (hasHandshakeParam) {
    return <OAuthCallback />;
  }

  // Otherwise, render the normal protected dashboard
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
} 