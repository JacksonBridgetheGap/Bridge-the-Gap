import { createContext, useEffect, useState } from "react";
import { httpRequest } from "../utils/utils.js";
import useAuth from "../hooks/useAuth.js";
import useUser from "../hooks/useUser.js";

const userGroupContext = createContext();

function UserGroupProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: userLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    setIsLoading(true);
    if (!auth || userLoading) return;
    const USER_GROUPS_URL = `/api/user/${user.id}/groups`;
    httpRequest(USER_GROUPS_URL, "GET")
      .then((groups) => {
        setGroups(groups);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setGroups, user, auth]);

  return (
    <userGroupContext.Provider value={{ groups, setGroups, isLoading }}>
      {children}
    </userGroupContext.Provider>
  );
}

export { userGroupContext, UserGroupProvider };
