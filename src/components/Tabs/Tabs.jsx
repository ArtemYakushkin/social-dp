import { LuBookmark } from "react-icons/lu";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { LiaIdCardSolid } from "react-icons/lia";
import { BiMessageRoundedDots } from "react-icons/bi";

const Tabs = ({ activeTab, setActiveTab, postCount }) => {
  return (
    <div className="container">
      <div className="tab">
        <button
          className={`tab-item ${activeTab === "about" ? "active" : ""}`}
          onClick={() => setActiveTab("about")}
        >
          <LiaIdCardSolid size={24} /> <p>About</p>
        </button>
        <button
          className={`tab-item ${activeTab === "message" ? "active" : ""}`}
          onClick={() => setActiveTab("message")}
        >
          <BiMessageRoundedDots size={24} /> <p className="tab-disable">Messages</p>
        </button>
        {postCount === 0 ? (
          <></>
        ) : (
          <button
            className={`tab-item ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            <HiOutlineClipboardDocumentList size={24} /> <p className="tab-disable">Posts</p>
          </button>
        )}
        <button
          className={`tab-item ${activeTab === "saved" ? "active" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          <LuBookmark size={24} /> <p className="tab-disable">Saved Posts</p>
        </button>
      </div>
    </div>
  );
};

export default Tabs;
