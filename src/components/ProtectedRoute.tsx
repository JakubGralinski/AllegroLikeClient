import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Navbar from "./Navbar";
import { Box } from "@mui/material";

type Props = {
  children: ReactNode;
  includeNavbar?: boolean;
};

function ProtectedRoute({ children, includeNavbar = false }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
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
