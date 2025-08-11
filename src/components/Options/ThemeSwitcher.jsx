import React, { useContext } from "react";

import { ThemeContext } from "../../context/ThemeContext";

import { LuSun, LuMoon } from "react-icons/lu";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkTheme = theme === "dark";

  return (
    <div className="switcher">
      <p className="switcher-title sortTitle">Site theme:</p>
      <div className="switcher-box">
        <LuSun
          onClick={toggleTheme}
          size={24}
          className={isDarkTheme ? "switcher-icon" : "switcher-icon-active"}
        />
        <label className="switcher-label" htmlFor="theme-toggle">
          <input
            className="switcher-input"
            type="checkbox"
            id="theme-toggle"
            checked={isDarkTheme}
            onChange={toggleTheme}
          />
          <div className="switcher-toggle"></div>
        </label>
        <LuMoon
          onClick={toggleTheme}
          size={24}
          className={isDarkTheme ? "switcher-icon-active" : "switcher-icon"}
        />
      </div>
    </div>
  );
};

export default ThemeSwitcher;
