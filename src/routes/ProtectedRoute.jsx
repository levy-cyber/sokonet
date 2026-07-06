import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { canAccessPath } from '../utils/portalAccess';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-dark-border border-t-brand rounded-full animate-spin"></div>
          <span className="text-xs text-brand font-mono uppercase tracking-widest">Loading Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const activeRole = user?.activeRole || user?.role || 'buyer';

  if (allowedRoles && !allowedRoles.some(r => r === activeRole)) {
    return <Navigate to="/" replace />;
  }

  if (!canAccessPath(activeRole, location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
