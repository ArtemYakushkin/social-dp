import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";

import DropdownSort from "./DropdownSort";
import SearchInput from "./SearchInput";
import ViewModeToggle from "./ViewModeToggle";
import ThemeSwitcher from "./ThemeSwitcher";
import ThemeSwitcherMobile from "./ThemeSwitcherMobile";

const Options = ({ onSearch, onSort, viewMode, setViewMode }) => {
  const [selectedOption, setSelectedOption] = useState("New");
  const [searchQuery, setSearchQuery] = useState("");

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <div className="container">
      <div className="options" id="options">
        <DropdownSort
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          onSort={onSort}
        />

        <SearchInput
          value={searchQuery}
          onChange={(q) => {
            setSearchQuery(q);
            onSearch(q);
          }}
        />

        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

        {isMobile ? <ThemeSwitcherMobile /> : <ThemeSwitcher />}
      </div>
    </div>
  );
};

export default Options;
