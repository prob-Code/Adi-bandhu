import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPathByRole } from '../../utils/roleRouting';

export default function RoleRedirect() {
  const { role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      navigate(getDashboardPathByRole(role), { replace: true });
    }
  }, [loading, role, navigate]);

  return null;
}
