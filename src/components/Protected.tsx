import { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Navigate } from "react-router-dom";

interface ProtectedProps {
  children: JSX.Element;
  roles: string[];
}

export default function Protected(props: ProtectedProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  if (props.roles.includes(user.role)) {
    return props.children;
  }

  // redirect to home page when no access to this route, but logged in
  return <Navigate to={"/"} replace />;
}
