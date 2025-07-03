import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AuthGuard from './components/AuthGuard';
import SSOCallback from './pages/SSOCallback';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - redirect to dashboard if already authenticated */}
        <Route 
          path="/" 
          element={
            <AuthGuard>
              <Login />
            </AuthGuard>
          } 
        />
        <Route 
          path="/login" 
          element={
            <AuthGuard>
              <Login />
            </AuthGuard>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <AuthGuard>
              <Signup />
            </AuthGuard>
          } 
        />

        {/* SSO Callback route - handles OAuth redirects */}
        <Route 
          path="/sso-callback" 
          element={<SSOCallback />} 
        />

        {/* Protected routes - require authentication */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all route for any unmatched paths - redirect to login */}
        <Route 
          path="*" 
          element={
            <AuthGuard>
              <Login />
            </AuthGuard>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
