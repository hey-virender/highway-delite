import { useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Wait for Clerk to load
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // If user is signed in and on a public route, redirect to dashboard
  const publicRoutes = ['/login', '/signup', '/'];
  if (isSignedIn && publicRoutes.includes(location.pathname)) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  // Otherwise, render children
  return <>{children}</>;
};

export default AuthGuard; 