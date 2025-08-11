import React from "react";
import { FiSearch } from "react-icons/fi";
import { useMediaQuery } from "react-responsive";

const SearchInput = ({ value, onChange }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

  return (
    <div className="search">
      <label>
        <input
          className="search-input sortItemText"
          type="text"
          placeholder={isTablet || isMobile ? "" : "Search posts"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <FiSearch className="search-icon" size={24} />
      </label>
    </div>
  );
};

export default SearchInput;
