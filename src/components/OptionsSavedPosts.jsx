import React, { useState, useRef, useContext } from "react";
import { useMediaQuery } from "react-responsive";

import { ThemeContext } from "../context/ThemeContext";

import { LuSun, LuMoon } from "react-icons/lu";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiSearch } from "react-icons/fi";

// import "../styles/Options.css";

const OptionsSavedPosts = ({ sortOrder, onSortChange, searchQuery, onSearchChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkTheme = theme === "dark";

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSortClick = (order) => {
    onSortChange(order === "Last ones first" ? "desc" : "asc");
    setIsOpen(false);
  };

  return (
    <div className="options" id="options">
      <div className="options-dropdown saved-options-dropdown" ref={dropdownRef}>
        <div className="options-dropdown-header" onClick={toggleDropdown}>
          <span className="options-title">Sort by:</span>
          <span className="options-selected">
            {sortOrder === "desc" ? "Last ones first" : "First things first"}
          </span>
          <span className="options-dropdown-icon">
            {isOpen ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
          </span>
        </div>
        {isOpen && (
          <ul className="options-dropdown-list">
            <li
              className="options-dropdown-item"
              onClick={() => handleSortClick("Last ones first")}
            >
              Last ones first
            </li>
            <li
              className="options-dropdown-item"
              onClick={() => handleSortClick("First things first")}
            >
              First things first
            </li>
          </ul>
        )}
      </div>

      <div className="options-search saved-options-search">
        <label>
          <input
            className="options-search-input"
            type="text"
            placeholder={isTablet || isMobile ? "" : "Search post"}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <FiSearch className="options-search-icon" size={24} />
        </label>
      </div>

      {isMobile ? (
        <div className="options-switcher">
          <button className="options-switcher-btn" onClick={toggleTheme}>
            {isDarkTheme ? <LuSun size={24} /> : <LuMoon size={24} />}
          </button>
        </div>
      ) : (
        <div className="options-switcher">
          <p className="options-switcher-title">Site theme:</p>
          <div className="options-switcher-box">
            <LuSun
              onClick={toggleTheme}
              size={24}
              className={isDarkTheme ? "options-switcher-icon" : "options-switcher-icon-active"}
            />
            <label className="options-switcher-label" htmlFor="theme-toggle">
              <input
                className="options-switcher-input"
                type="checkbox"
                id="theme-toggle"
                checked={isDarkTheme}
                onChange={toggleTheme}
              />
              <div className="options-switcher-toggle"></div>
            </label>
            <LuMoon
              onClick={toggleTheme}
              size={24}
              className={isDarkTheme ? "options-switcher-icon-active" : "options-switcher-icon"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionsSavedPosts;
