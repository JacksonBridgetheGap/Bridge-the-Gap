import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth.js";
import BridgeTheGapLoadingSpinner from "./BridgeTheGapLoadingSpinner.jsx";

const ProtectedRoute = () => {
  const { auth, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={"flex flex-col items-center justify-center"}>
        <BridgeTheGapLoadingSpinner />
      </div>
    );
  }

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
