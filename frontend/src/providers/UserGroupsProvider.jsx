import { useEffect, useState, useContext } from "react";
import { userGroupsContext as UserGroupsContext } from "../context/UserGroupsContext.jsx";
import { authContext } from "../context/AuthContext.jsx";
import { httpRequest } from "../utils/utils.js";
import useUser from "../hooks/useUser.js";
import { DateTime } from "luxon";

function UserGroupProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: userLoading } = useUser();
  const { auth, isLoading: loading } = useContext(authContext);

  useEffect(() => {
    setIsLoading(true);
    if (!auth || userLoading || loading || user == null) return;
    const USER_GROUPS_URL = `${import.meta.env.VITE_BASE_URL}/api/user/${user.id}/groups`;
    httpRequest(USER_GROUPS_URL, "GET")
      .then((groups) => {
        setGroups(
          groups.map((group) => {
            return {
              ...group,
              events: group.events.map((event) => {
                event.start = DateTime.fromISO(event.start, { zone: "utc" })
                  .toLocal()
                  .toISO({ suppressMilliseconds: true, includeOffset: false });
                event.end = DateTime.fromISO(event.end, { zone: "utc" })
                  .toLocal()
                  .toISO({ suppressMilliseconds: true, includeOffset: false });
                return event;
              }),
            };
          }),
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setGroups, user, auth, userLoading, loading]);

  return (
    <UserGroupsContext.Provider value={{ groups, setGroups, isLoading }}>
      {children}
    </UserGroupsContext.Provider>
  );
}

export { UserGroupProvider };
