import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

// 1. RequireAuth: Ensures user is logged in
export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading session...</div>;
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// 2. RequireGuest: Ensures user is NOT logged in (e.g. for /login page)
export const RequireGuest = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isOnboarded } = useAuthStore();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading session...</div>;
  
  if (user) {
    // If logged in, redirect to app or onboarding
    return <Navigate to={isOnboarded ? "/app/dashboard" : "/onboarding"} replace />;
  }
  return <>{children}</>;
};

// 3. RequireOnboarding: Ensures user has completed onboarding
export const RequireOnboarding = ({ children }: { children: React.ReactNode }) => {
  const { user, isOnboarded, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading session...</div>;
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};
