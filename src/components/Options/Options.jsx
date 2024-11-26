import React, { useState } from "react";
import { LuSun, LuMoon } from "react-icons/lu";
import { ReactComponent as Search } from "../../assets/icons/search.svg";
import { ReactComponent as ArrowDown } from "../../assets/icons/arrow-down.svg";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import "./Options.css";

const Options = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Newest");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const options = ["Most commented", "Most liked"];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const toggleSwitcher = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className="options">
      <div className="options-dropdown">
        <div className="options-dropdown-header" onClick={toggleDropdown}>
          <span className="options-title">Sort by:</span>
          <span className="options-selected">Newest</span>
          <span className="options-dropdown-icon">
            {isOpen ? <ArrowUp /> : <ArrowDown />}
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
        <Search className="options-search-icon" />
        <input
          className="options-search-input"
          type="text"
          placeholder="Search post"
        ></input>
      </div>

      <div className="options-switcher">
        <p className="options-switcher-title">Site theme:</p>
        <div className="options-switcher-box">
          <LuSun
            size={24}
            className={
              isDarkTheme
                ? "options-switcher-icon"
                : "options-switcher-icon-active"
            }
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
            className={
              isDarkTheme
                ? "options-switcher-icon-active"
                : "options-switcher-icon"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Options;
