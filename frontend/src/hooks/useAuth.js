import { useContext } from "react";
import { authContext } from "../context/AuthContext.jsx";

export default function useAuth() {
  const { auth, isLoading } = useContext(authContext);
  if (isLoading) {
    return { auth: null, isLoading: true };
  } else {
    return { auth, isLoading: false };
  }
}
