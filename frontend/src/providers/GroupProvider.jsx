import { createContext, useEffect, useState } from "react";
import { httpRequest } from "../utils/utils.js";
import useAuth from "../hooks/useAuth.js";

const groupContext = createContext();

const GROUPS_URL = `${import.meta.env.VITE_BASE_URL}/api/groups`;

function GroupProvider(props) {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    setIsLoading(true);

    if (!auth) return;
    httpRequest(GROUPS_URL, "GET")
      .then((groupList) => {
        setGroups(groupList);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setGroups, auth]);

  return (
    <groupContext.Provider value={{ groups, setGroups, isLoading }}>
      {props.children}
    </groupContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { groupContext, GroupProvider };
