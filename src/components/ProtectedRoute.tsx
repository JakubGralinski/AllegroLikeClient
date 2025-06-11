import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Navbar from "./Navbar";
import { Box } from "@mui/material";
import { ADMIN } from "../lib/constants";
import UnauthorizedPage from "./UnauthorizedPage";

type Props = {
  children: ReactNode;
  includeNavbar?: boolean;
  requireRole?: "ROLE_ADMIN" | "ROLE_USER";
  showUnauthorizedPage?: boolean;
};

function ProtectedRoute({ 
  children, 
  includeNavbar = false, 
  requireRole, 
  showUnauthorizedPage = false 
}: Props) {
  const user = useSelector((state: RootState) => state.auth.user);

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if required
  if (requireRole && user.role !== requireRole) {
    // If admin role is required but user is not admin
    if (requireRole === "ROLE_ADMIN") {
      if (showUnauthorizedPage) {
        return (
          <>
            {includeNavbar && <Navbar />}
            <Box component="main" sx={{ ml: { sm: "240px" } }}>
              <UnauthorizedPage />
            </Box>
          </>
        );
      }
      return <Navigate to="/" replace />;
    }
    // For other role mismatches, redirect to login
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {includeNavbar && <Navbar />}
      <Box component="main" sx={{ ml: { sm: "240px" } }}>
        {children}
      </Box>
    </>
  );
}

export default ProtectedRoute;
