import { useMediaQuery } from "react-responsive";

import { FiSearch } from "react-icons/fi";

const SearchSavePost = ({ value, onSearchChange }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

  return (
    <div className="search saved-options-search">
      <label>
        <input
          className="search-input sortItemText"
          type="text"
          placeholder={isTablet || isMobile ? "" : "Search post"}
          value={value}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <FiSearch className="search-icon" size={24} />
      </label>
    </div>
  );
};

export default SearchSavePost;
