import "../styles/Navagation.css";
import { useState } from "react";
import useSearch from "../hooks/useSearch.js";

export function Navagation({ onSearch, onClear }) {
  const [searchedTerm, setSearchedTerm] = useState("");
  const { setSearchTerm } = useSearch();

  const handleSearch = () => {
    setSearchTerm(searchedTerm);
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
      <button className={"search-button"} onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}
