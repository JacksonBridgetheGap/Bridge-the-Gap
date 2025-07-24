import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth.js";

const ProtectedRoute = () => {
  const auth = useAuth();

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
