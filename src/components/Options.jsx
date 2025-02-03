import React, { useState } from "react";

import { LuSun, LuMoon } from "react-icons/lu";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiSearch } from "react-icons/fi";

import "../styles/Options.css";

const Options = ({ onSearch, onSort, viewMode, setViewMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const options = ["Newest", "Most commented", "Most liked"];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSort(option);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const toggleSwitcher = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className="options" id="options">
      <div className="options-dropdown">
        <div className="options-dropdown-header" onClick={toggleDropdown}>
          <span className="options-title">Sort by:</span>
          <span className="options-selected">{selectedOption}</span>
          <span className="options-dropdown-icon">
            {isOpen ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
          </span>
        </div>
        {isOpen && (
          <ul className="options-dropdown-list">
            {options.map((option) => (
              <li
                key={option}
                className="options-dropdown-item"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="options-search">
        <FiSearch className="options-search-icon" size={24} />
        <input
          className="options-search-input"
          type="text"
          placeholder="Search post"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="options-choise">
        <p className="options-choise-title">Display modes:</p>
        <div
          className={viewMode === "grid" ? "options-choice-square-active" : "options-choice-square"}
          onClick={() => setViewMode("grid")}
        >
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div
          className={viewMode === "list" ? "options-choice-line-active" : "options-choice-line"}
          onClick={() => setViewMode("list")}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div className="options-switcher">
        <p className="options-switcher-title">Site theme:</p>
        <div className="options-switcher-box">
          <LuSun
            size={24}
            className={isDarkTheme ? "options-switcher-icon" : "options-switcher-icon-active"}
          />
          <label className="options-switcher-label" htmlFor="theme-toggle">
            <input
              className="options-switcher-input"
              type="checkbox"
              id="theme-toggle"
              checked={isDarkTheme}
              onChange={toggleSwitcher}
            />
            <div className="options-switcher-toggle"></div>
          </label>
          <LuMoon
            size={24}
            className={isDarkTheme ? "options-switcher-icon-active" : "options-switcher-icon"}
          />
        </div>
      </div>
    </div>
  );
};

export default Options;
