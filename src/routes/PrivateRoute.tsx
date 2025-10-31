// src/routes/PrivateRoute.tsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../redux/store/store";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const isTokenValid = (): boolean => {
  const token = localStorage.getItem("access_token");
  const expiry = localStorage.getItem("token_expiry");
  if (!token || !expiry) return false;
  return Date.now() < Number(expiry);
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const location = useLocation();
  const { authenticated, user } = useSelector((state: RootState) => state.auth);

  if (!authenticated || !isTokenValid()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    allowedRoles &&
    user?.role &&
    !allowedRoles.includes(user.role.toLowerCase())
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
