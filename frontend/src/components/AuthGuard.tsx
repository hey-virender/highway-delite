import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../hooks/axiosInstance';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isLoaded, userId, getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  // Reset check when location changes
  useEffect(() => {
    setHasChecked(false);
    setIsChecking(true);
    setShouldRender(false);
  }, [location.pathname]);

  useEffect(() => {
    const checkAuthentication = async () => {
      // Prevent multiple checks
      if (hasChecked) return;
      
      if (!isLoaded) return; // Wait for Clerk to load

      console.log('AuthGuard: Checking authentication...', { userId, isLoaded });

      if (!userId) {
        // No user logged in, allow access to login/signup
        console.log('AuthGuard: No userId, allowing access to auth pages');
        setShouldRender(true);
        setIsChecking(false);
        setHasChecked(true);
        return;
      }

      // If user exists in Clerk, they're likely authenticated
      // Redirect to dashboard and let ProtectedRoute handle validation
      console.log('AuthGuard: User exists, redirecting to dashboard');
      try {
        // Store session token for later use
        const sessionToken = await getToken();
        if (sessionToken) {
          localStorage.setItem('clerk_session_token', sessionToken);
        }
      } catch (error) {
        console.log('AuthGuard: Could not get token, but redirecting anyway');
      }
      
      navigate('/dashboard', { replace: true });
      setHasChecked(true);
    };

    checkAuthentication();
  }, [isLoaded, userId, navigate, hasChecked]);

  // Show loading spinner while checking
  if (isChecking || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Render login/signup content if user is not authenticated
  return shouldRender ? <>{children}</> : null;
};

export default AuthGuard; 