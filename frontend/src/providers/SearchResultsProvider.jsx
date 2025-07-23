import { useEffect, useState } from "react";
import { searchResultsContext as SearchResultsContext } from "../context/SearchResultsContext.jsx";
import { httpRequest } from "../utils/utils.js";
import useAuth from "../hooks/useAuth.js";

function SearchResultsProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const auth = useAuth();

  const SEARCH_URL = `${import.meta.env.VITE_BASE_URL}/api/groups/?name=${searchTerm}`;

  useEffect(() => {
    if (auth) {
      httpRequest(SEARCH_URL, "GET").then((groups) => {
        setGroups(groups);
      });
    }
  }, [searchTerm, SEARCH_URL, auth]);

  return (
    <SearchResultsContext.Provider
      value={{ groups, searchTerm, setSearchTerm }}
    >
      {children}
    </SearchResultsContext.Provider>
  );
}

export { SearchResultsProvider };
