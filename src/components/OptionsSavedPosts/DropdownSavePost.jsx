import { useState, useEffect, useRef } from "react";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const DropdownSavePost = ({ onSortChange, sortOrder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSortClick = (order) => {
    onSortChange(order === "Newest" ? "desc" : "asc");
    setIsOpen(false);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        <span className="dropdown-title sortTitle">Sort by:</span>
        <span className="dropdown-selected sortSelect">
          {sortOrder === "desc" ? "Newest" : "Oldest"}
        </span>
        <span className="dropdown-icon">
          {isOpen ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
        </span>
      </div>
      {isOpen && (
        <ul className="dropdown-list">
          <li className="dropdown-item sortItemText" onClick={() => handleSortClick("Newest")}>
            Newest
          </li>
          <li className="dropdown-item sortItemText" onClick={() => handleSortClick("Oldest")}>
            Oldest
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropdownSavePost;
