import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: Props) => {
  const { isAuthenticated, user } = useAuth();

  // If user is logged in AND is admin, allow access
  if (isAuthenticated && user?.isAdmin) {
    return <>{children}</>;
  }

  // Otherwise, always redirect to admin login page
  return <Navigate to="/admin-login" replace />;
};

export default ProtectedAdminRoute;
