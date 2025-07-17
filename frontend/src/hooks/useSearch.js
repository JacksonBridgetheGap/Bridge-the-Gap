import { useContext } from "react";
import { searchResultsContext } from "../context/SearchResultsContext.jsx";

export default function useSearch() {
  const { searchTerm, setSearchTerm, groups } =
    useContext(searchResultsContext);

  return { searchTerm, setSearchTerm, groups };
}
