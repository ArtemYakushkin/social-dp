import { useMediaQuery } from "react-responsive";

import DropdownSavePost from "./DropdownSavePost";
import SearchSavePost from "./SearchSavePost";
import ThemeSwitcher from "../Options/ThemeSwitcher";
import ThemeSwitcherMobile from "../Options/ThemeSwitcherMobile";

const OptionsSavedPosts = ({ sortOrder, onSortChange, searchQuery, onSearchChange }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <div className="container">
      <div className="options">
        <DropdownSavePost onSortChange={onSortChange} sortOrder={sortOrder} />

        <SearchSavePost value={searchQuery} onSearchChange={onSearchChange} />

        {isMobile ? <ThemeSwitcherMobile /> : <ThemeSwitcher />}
      </div>
    </div>
  );
};

export default OptionsSavedPosts;
