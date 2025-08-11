import { useMediaQuery } from "react-responsive";

import DropdownProfPost from "./DropdownProfPost";
import SearchProfPost from "./SearchProfPost";
import ThemeSwitcher from "../Options/ThemeSwitcher";
import ThemeSwitcherMobile from "../Options/ThemeSwitcherMobile";

const OptionsProfilePosts = ({
  searchQuery,
  onSearchChange,
  selectedOption,
  onSortChange,
  setSearchQuery,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <div className="container">
      <div className="options">
        <DropdownProfPost selectedOption={selectedOption} onSortChange={onSortChange} />

        <SearchProfPost
          value={searchQuery}
          onChange={(q) => {
            setSearchQuery(q);
            onSearchChange(q);
          }}
        />

        {isMobile ? <ThemeSwitcherMobile /> : <ThemeSwitcher />}
      </div>
    </div>
  );
};

export default OptionsProfilePosts;
