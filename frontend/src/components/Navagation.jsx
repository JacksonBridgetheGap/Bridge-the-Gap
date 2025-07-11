import "../styles/Navagation.css";
import { useState, useDeferredValue } from "react";
import useSearch from "../hooks/useSearch.js";

export function Navagation({ onSearch, onClear }) {
  const [searchedTerm, setSearchedTerm] = useState("");
  const deferredTerm = useDeferredValue(searchedTerm);
  const { setSearchTerm } = useSearch();

  const handleSearch = () => {
    setSearchTerm(deferredTerm);
    onSearch();
  };

  const handleInput = (evt) => {
    if (evt.target.value === "") {
      handleClear();
    } else if (evt.key === "Enter") {
      handleSearch();
    } else {
      setSearchedTerm(evt.target.value);
    }
  };

  const handleClear = () => {
    setSearchedTerm("");
    onClear();
  };

  return (
    <div>
      <input
        type="search"
        placeholder="Search..."
        className="search-bar"
        value={searchedTerm}
        onInput={handleInput}
        onKeyDown={handleInput}
      />
      <button
        className={
          "text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-small rounded-full text-sm px-4 py-1.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        }
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}
