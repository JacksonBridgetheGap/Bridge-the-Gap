import { useState, useEffect } from "react";
import { userContext as UserContext } from "../context/UserContext.jsx";
import { convertEventsToLocal, httpRequest } from "../utils/utils.js";
import useAuth from "../hooks/useAuth.js";
import { DateTime } from "luxon";

const USER_URL = `/api/me`;

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();
  useEffect(() => {
    setIsLoading(true);
    if (auth) {
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
  }, [auth, setUser]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider };
