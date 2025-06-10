import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "./Navbar.tsx";
import { ADMIN } from "../lib/constants.ts";

interface ProtectedRouteProps {
  children: React.ReactNode;
  includeNavbar: boolean;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  includeNavbar,
  adminOnly = false,
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== ADMIN) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (includeNavbar) {
    return (
        <div className="flex items-center justify-center gap-10">
          <Navbar />
          <div>
            {children}
          </div>
        </div>
    )
  }

  return <>{children}</>;
};

export default ProtectedRoute;
