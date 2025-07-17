import { useEffect, useState } from "react";
import { userGroupsContext as UserGroupsContext } from "../context/UserGroupsContext.jsx";
import { httpRequest } from "../utils/utils.js";
import useAuth from "../hooks/useAuth.js";
import useUser from "../hooks/useUser.js";

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
  }, [setGroups, user, auth, userLoading]);

  return (
    <UserGroupsContext.Provider value={{ groups, setGroups, isLoading }}>
      {children}
    </UserGroupsContext.Provider>
  );
}

export { UserGroupProvider };
