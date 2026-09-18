import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to default home based on user's actual role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'organizer':
        return <Navigate to="/organizer/dashboard" replace />;
      case 'staff':
        return <Navigate to="/staff/dashboard" replace />;
      case 'speaker':
        return <Navigate to="/speaker/dashboard" replace />;
      case 'sponsor':
        return <Navigate to="/sponsor/dashboard" replace />;
      case 'attendee':
      default:
        return <Navigate to="/attendee/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default RoleRoute;
