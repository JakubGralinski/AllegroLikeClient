import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "./Navbar.tsx";
import { Box } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
  includeNavbar: boolean | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  includeNavbar,
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {includeNavbar && <Navbar />}
      <Box component="main" sx={{ ml: { sm: "240px" } }}>
        {children}
      </Box>
    </>
  );
};

export default ProtectedRoute;
