import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardPathByRole } from '../utils/roleRouting';

export default function PublicRoute() {
  const { session, role, loading } = useAuth();
  if (loading) return null;
  if (session) {
    return <Navigate to={getDashboardPathByRole(role)} replace />;
  }
  return <Outlet />;
}
