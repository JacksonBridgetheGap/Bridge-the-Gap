import { useEffect, useState } from "react";
import { authContext as AuthContext } from "../context/AuthContext.jsx";
import { getCookie } from "../utils/utils.js";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("token");

    if (token || auth) {
      fetch(`${import.meta.env.VITE_BASE_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            setAuth(false);
            throw new Error("Invalid token");
          }
          setAuth(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [setAuth, auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
