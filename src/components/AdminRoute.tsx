import { ReactNode } from "react";
import ProtectedRoute from "./ProtectedRoute";

type Props = {
  children: ReactNode;
  includeNavbar?: boolean;
};

/**
 * AdminRoute - A specialized protected route that requires ROLE_ADMIN access
 * Used for protecting admin-only features like dashboard charts, product management, etc.
 */
function AdminRoute({ children, includeNavbar = false }: Props) {
  return (
    <ProtectedRoute includeNavbar={includeNavbar} requireRole="ROLE_ADMIN">
      {children}
    </ProtectedRoute>
  );
}

export default AdminRoute; 