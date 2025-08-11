import React from "react";

const ViewModeToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="choise">
      <p className="choise-title sortTitle">Display modes:</p>
      <div
        className={viewMode === "grid" ? "choice-square-active" : "choice-square"}
        onClick={() => setViewMode("grid")}
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div
        className={viewMode === "list" ? "choice-line-active" : "choice-line"}
        onClick={() => setViewMode("list")}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default ViewModeToggle;
