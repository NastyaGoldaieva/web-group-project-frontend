import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * RequireAuth wrapper for react-router v6.
 * Usage:
 *   <Route path="/dashboard" element={<RequireAuth><DashboardPage/></RequireAuth>} />
 *
 * It checks for an access token in localStorage and redirects to /login if missing.
 */
export default function RequireAuth({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}