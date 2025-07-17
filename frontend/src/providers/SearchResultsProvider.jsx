import { useEffect, useState } from "react";
import { searchResultsContext as SearchResultsContext } from "../context/SearchResultsContext.jsx";
import { httpRequest } from "../utils/utils.js";

function SearchResultsProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const SEARCH_URL = `/api/groups/?name=${searchTerm}`;

  useEffect(() => {
    httpRequest(SEARCH_URL, "GET").then((groups) => {
      setGroups(groups);
    });
  }, [searchTerm, SEARCH_URL]);

  useEffect(() => {});

  return (
    <SearchResultsContext.Provider
      value={{ groups, searchTerm, setSearchTerm }}
    >
      {children}
    </SearchResultsContext.Provider>
  );
}

export { SearchResultsProvider };
