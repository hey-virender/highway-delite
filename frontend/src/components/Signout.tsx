
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axiosInstance from '../hooks/axiosInstance';
import { clearAuthToken } from '../hooks/axiosInstance';
import { useState } from 'react';

const Signout = () => {
  const { signOut, userId } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      // Call backend to clear session
      if (userId) {
        await axiosInstance.post('/user/logout', {
          user_id: userId
        });
      }
      
      // Clear all tokens from localStorage
      clearAuthToken();
      
      // Sign out from Clerk
      await signOut();
      
      toast.success('Successfully signed out');
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if backend fails, still clear local session
      clearAuthToken();
      await signOut();
      
      toast.success('Signed out');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSignOut}
      disabled={isLoading}
      className="bg-transparent text-blue-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </button>
  );
};

export default Signout;