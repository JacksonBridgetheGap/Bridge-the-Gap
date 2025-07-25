import { useContext } from "react";
import { authContext } from "../context/AuthContext.jsx";

export default function useAuth() {
  const { auth, isLoading, setAuth } = useContext(authContext);
  if (isLoading) {
    return { auth: null, isLoading: true, setAuth };
  } else {
    return { auth, isLoading: false, setAuth };
  }
}
