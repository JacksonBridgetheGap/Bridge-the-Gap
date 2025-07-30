import { useState, useEffect, useContext } from "react";
import { userContext as UserContext } from "../context/UserContext.jsx";
import { authContext } from "../context/AuthContext.jsx";
import { convertEventsToLocal, httpRequest } from "../utils/utils.js";

const USER_URL = `${import.meta.env.VITE_BASE_URL}/api/me`;

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { auth, isLoading: loading } = useContext(authContext);
  useEffect(() => {
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
    } else {
      setIsLoading(false);
    }
  }, [auth, setUser, loading]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider };
