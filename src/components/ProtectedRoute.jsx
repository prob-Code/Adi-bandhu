import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowPublic = false }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (allowPublic) return <Outlet />;

  if (loading) return null;

  if (!session) {
    return <Navigate to={`/auth/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }
  return <Outlet />;
}
