import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { LiaIdCardSolid } from 'react-icons/lia';

const TabsAuthor = ({ activeTab, setActiveTab, author }) => {
  return (
    <div className="container">
      <div className="tab">
        <button
          className={`tab-item ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          <LiaIdCardSolid size={24} /> About
        </button>

        {author.createdPosts.length === 0 ? (
          <></>
        ) : (
          <button
            className={`tab-item ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <HiOutlineClipboardDocumentList size={24} /> Posts ({author.createdPosts.length})
          </button>
        )}
      </div>
    </div>
  );
};

export default TabsAuthor;
