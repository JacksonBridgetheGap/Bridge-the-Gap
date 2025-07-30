import { createContext, useEffect, useState } from "react";
import { httpRequest } from "../utils/utils.js";
import useAuth from "../hooks/useAuth.js";

const groupContext = createContext();

const GROUPS_URL = `${import.meta.env.VITE_BASE_URL}/api/groups`;
const GRAPHQL_URL = `${import.meta.env.VITE_BASE_URL}/api/graphql`;

const query = `
query {
  allGroups {
    id
    name
    img
    members {
      id
      username
    }
  }
}
`;

function GroupProvider(props) {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { auth, isLoading: loading } = useAuth();

  useEffect(() => {
    setIsLoading(true);

    if (!auth || loading) return;
    httpRequest(GRAPHQL_URL, "POST", { query })
      .then((response) => {
        const { allGroups } = response.data;
        setGroups(allGroups);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setGroups, auth, loading]);

  return (
    <groupContext.Provider value={{ groups, setGroups, isLoading }}>
      {props.children}
    </groupContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { groupContext, GroupProvider };
