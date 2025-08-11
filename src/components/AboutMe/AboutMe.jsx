import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AboutMe = ({
  aboutMe,
  tempAboutMe,
  setTempAboutMe,
  isEditingAbout,
  setIsEditingAbout,
  errors,
  handlePublishAboutMe,
}) => {
  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  return (
    <div className="container">
      <div className="me">
        <div className="me-header">
          <h2 className="tabsTitle">About Me</h2>
          <button
            className="me-edit-btn"
            onClick={() => {
              setTempAboutMe(aboutMe);
              setIsEditingAbout(true);
            }}
          >
            Edit information
          </button>
        </div>

        {stripHtml(aboutMe).trim() ? (
          <p className="aboutMeText" dangerouslySetInnerHTML={{ __html: aboutMe }}></p>
        ) : (
          <p className="aboutMeText">No information</p>
        )}

        {isEditingAbout && (
          <div className="me-container">
            <div className="me-box">
              <ReactQuill value={tempAboutMe} onChange={setTempAboutMe} theme="snow" />
            </div>
            {errors.aboutMe && <span className="me-error errorText">{errors.aboutMe}</span>}
            <div className="me-actions">
              <button className="btnModerateFill" onClick={handlePublishAboutMe}>
                Post
              </button>
              <button className="btnModerateTransparent" onClick={() => setIsEditingAbout(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutMe;
