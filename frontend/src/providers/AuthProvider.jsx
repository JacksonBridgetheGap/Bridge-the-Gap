import { useEffect, useState } from "react";
import { authContext as AuthContext } from "../context/AuthContext.jsx";
import { httpRequest } from "../utils/utils.js";

const AUTH_URL = "/api/auth/session";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    httpRequest(AUTH_URL, "GET").then((auth) => {
      setAuth(auth.userExists);
    });
  }, [setAuth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
