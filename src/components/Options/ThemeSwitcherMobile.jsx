import React, { useContext } from "react";

import { ThemeContext } from "../../context/ThemeContext";

import { LuSun, LuMoon } from "react-icons/lu";

const ThemeSwitcherMobile = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkTheme = theme === "dark";

  return (
    <div className="switcher">
      <button className="switcher-btn" onClick={toggleTheme}>
        {isDarkTheme ? <LuSun size={24} /> : <LuMoon size={24} />}
      </button>
    </div>
  );
};

export default ThemeSwitcherMobile;
