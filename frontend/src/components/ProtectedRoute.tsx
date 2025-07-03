import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../hooks/axiosInstance';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoaded, userId, getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  // Reset check when location changes
  useEffect(() => {
    setHasChecked(false);
    setIsVerifying(true);
    setIsAuthenticated(false);
  }, [location.pathname]);

  useEffect(() => {
    const verifyAuthentication = async () => {
      // Prevent multiple checks
      if (hasChecked) return;
      
      if (!isLoaded) return; // Wait for Clerk to load

      console.log('ProtectedRoute: Checking authentication...', { userId, isLoaded });

      if (!userId) {
        // No user logged in with Clerk
        console.log('ProtectedRoute: No userId, redirecting to login');
        setIsAuthenticated(false);
        setIsVerifying(false);
        setHasChecked(true);
        navigate('/login');
        return;
      }

      try {
        // If Clerk says user is authenticated, trust it initially
        setIsAuthenticated(true);
        
        // Get and store session token for API calls
        const sessionToken = await getToken();
        if (sessionToken) {
          localStorage.setItem('clerk_session_token', sessionToken);
        }
        
        console.log('ProtectedRoute: User authenticated');
      } catch (error) {
        console.error('ProtectedRoute: Authentication check failed:', error);
        
        // Clear invalid tokens
        localStorage.removeItem('clerk_session_token');
        
        setIsAuthenticated(false);
        toast.error('Authentication failed. Please log in again.');
        navigate('/login');
      } finally {
        setIsVerifying(false);
        setHasChecked(true);
      }
    };

    verifyAuthentication();
  }, [isLoaded, userId, navigate, hasChecked]);

  // Show loading spinner while verifying
  if (isVerifying || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Render protected content if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute; 