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
    <div className="relative w-1/2">
      <input
        type="search"
        placeholder="Search..."
        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-500 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={searchedTerm}
        onInput={handleInput}
        onKeyDown={handleInput}
      />
      <div className="absolute end-2.5 bottom-2.5">
        <div className="flex gap-2">
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleClear}
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
}
