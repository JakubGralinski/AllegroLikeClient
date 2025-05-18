import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "./Navbar.tsx";

interface ProtectedRouteProps {
  children: React.ReactNode;
  includeNavbar: boolean | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, includeNavbar }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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
