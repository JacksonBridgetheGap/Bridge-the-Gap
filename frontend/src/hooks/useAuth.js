import { useContext } from "react";
import { authContext } from "../context/AuthContext.jsx";

export default function useAuth() {
  const { auth } = useContext(authContext);
  return auth;
}
