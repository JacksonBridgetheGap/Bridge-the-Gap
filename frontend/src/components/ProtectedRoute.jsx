import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth.js";

const ProtectedRoute = () => {
  const { auth, isLoading } = useAuth();

  if (!isLoading) {
    return auth ? <Outlet /> : <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
