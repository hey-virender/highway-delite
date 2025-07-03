import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AuthGuard from './components/AuthGuard';

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

        {/* Protected routes - require authentication */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
