import { useEffect, useState } from "react";
import { authContext as AuthContext } from "../context/AuthContext.jsx";
import { getCookie } from "../utils/utils.js";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = getCookie("token");

    if (token) {
      fetch(`${import.meta.env.VITE_BASE_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then(() => {
          setAuth(true);
        })
        .catch((err) => {
          console.log(err);
          setAuth(false);
        });
    }
  }, [setAuth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
