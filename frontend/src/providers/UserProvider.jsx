import { useState, useEffect } from "react";
import { userContext as UserContext } from "../context/UserContext.jsx";
import { convertEventsToLocal, httpRequest } from "../utils/utils.js";
import useAuth from "../hooks/useAuth.js";

const USER_URL = `${import.meta.env.VITE_BASE_URL}/api/me`;

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { auth, isLoading: loading } = useAuth();
  useEffect(() => {
    setIsLoading(true);
    if (auth && !loading) {
      httpRequest(USER_URL, "GET")
        .then((user) => {
          setUser({
            ...user,
            events: convertEventsToLocal(user.events),
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [auth, setUser, loading]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider };
