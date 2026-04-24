import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CursorGlow from './components/common/CursorGlow';

// Loading screen shown while auth state is being determined
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase">Verificando acesso...</p>
    </div>
  );
}

// Protects /admin/* routes: requires authenticated AND admin user
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, logout } = useAuth();

  // Wait for auth state to resolve before making any decision
  if (loading) return <LoadingScreen />;

  // Not authenticated at all → login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but NOT admin
  if (!isAdmin) {
    // Se estiver logado mas não for admin, garantimos que ele não "finja" ser um
    // e o enviamos para o login onde verá a mensagem de "pendente"
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Redirects already-logged-in admins away from the login page
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  // If user is already logged in and is admin, send them to the admin panel
  if (user && isAdmin) return <Navigate to="/admin" replace />;

  return <>{children}</>;
}

// Catch-all: redirect any unknown URL back to the landing page
function NotFound() {
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <CursorGlow />
      <BrowserRouter>
        <Routes>
          {/* Public: Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Public only: Login/Register (redirects admins to /admin) */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          {/* Protected: Admin panel — requires authenticated admin user */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Public: Forgot & Reset Password */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Catch-all: anything else goes to landing page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
