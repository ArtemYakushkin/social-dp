import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { fetchAuthorData, fetchAuthorPosts } from '../../utils/authorUtils';
import { stripHtml } from '../../utils/textUtils';

import CardProfile from '../../components/CardProfile/CardProfile';
import TabsAuthor from '../../components/TabsAuthor/TabsAuthor';
import AboutAuthor from '../../components/AboutAuthor/AboutAuthor';
import Loader from '../../components/Loader';
import PopularPosts from '../../components/PopularPosts/PopularPosts';
// import AuthorMessagesForm from '../../components/MessagesForm/AuthorMessagesForm';
import MessagesList from '../../components/MessagesList/MessagesList';

import avatarPlaceholder from '../../assets/avatar.png';
import coverPlaceholder from '../../assets/cover-img.png';
import facebook from '../../assets/facebook.png';
import instagram from '../../assets/instagram.png';
import telegram from '../../assets/telegram.png';

const AuthorProfilePage = () => {
  const { uid } = useParams();
  const [author, setAuthor] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [authorPosts, setAuthorPosts] = useState([]);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1259px)' });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadAuthor = async () => {
      const data = await fetchAuthorData(uid);
      if (data) setAuthor(data);
      else console.error('No such user!');
    };

    loadAuthor();
  }, [uid]);

  useEffect(() => {
    const loadPosts = async () => {
      const posts = await fetchAuthorPosts(author?.createdPosts);
      setAuthorPosts(posts);
    };

    if (activeTab === 'posts') {
      loadPosts();
    }
  }, [activeTab, author?.createdPosts]);

  return (
    <>
      <div className="app">
        {author ? (
          // <>
          //   {isMobile ? (
          //     <>
          //       {/* <div className="app-info">
          //         <div className="app-avatar-img">
          //           <img
          //             src={author.avatar || avatarPlaceholder}
          //             alt={`${author.nickname}'s avatar`}
          //           />
          //         </div>

          //         <div className="app-cover">
          //           {author.cover && <img src={author.cover} alt={`${author.cover}'s`} />}
          //         </div>

          //         <div className="container">
          //           <div className="app-social">
          //             {author.facebook && (
          //               <a href={author.facebook} target="_blank" rel="noopener noreferrer">
          //                 <img src={facebook} alt="facebook" />
          //               </a>
          //             )}
          //             {author.instagram && (
          //               <a href={author.instagram} target="_blank" rel="noopener noreferrer">
          //                 <img src={instagram} alt="instagram" />
          //               </a>
          //             )}
          //             {author.telegram && (
          //               <a href={author.telegram} target="_blank" rel="noopener noreferrer">
          //                 <img src={telegram} alt="telegram" />
          //               </a>
          //             )}
          //           </div>
          //         </div>

          //         <div className="container">
          //           <h1 className="app-nickname">{author.nickname}</h1>
          //           <div className="app-line-box">
          //             <div></div>
          //           </div>
          //           <ul className="app-status">
          //             <li className="app-item">
          //               <p>
          //                 Country: <span>{author.country}</span>
          //               </p>
          //             </li>
          //             <li className="app-item">
          //               <p>
          //                 Status on the site: <span>{author.profession}</span>
          //               </p>
          //             </li>
          //           </ul>
          //         </div>
          //       </div>
          //       <div className="container">
          //         <div className="app-tabs">
          //           <button
          //             className={`app-tabs-btn ${
          //               activeTab === 'about' ? 'app-tabs-btn-active' : ''
          //             }`}
          //             onClick={() => setActiveTab('about')}
          //           >
          //             <LiaIdCardSolid size={24} /> About
          //           </button>
          //           {author.createdPosts.length === 0 ? (
          //             <></>
          //           ) : (
          //             <button
          //               className={`app-tabs-btn ${
          //                 activeTab === 'posts' ? 'app-tabs-btn-active' : ''
          //               }`}
          //               onClick={() => setActiveTab('posts')}
          //             >
          //               <HiOutlineClipboardDocumentList size={24} /> Posts (
          //               {author.createdPosts.length})
          //             </button>
          //           )}
          //         </div>

          //         <div className="profile-tabs-content">
          //           {activeTab === 'about' && (
          //             <>
          //               <div className="app-about">
          //                 <h2 className="app-about-title">About author</h2>
          //                 {stripHtml(author.aboutMe).trim() ? (
          //                   <p
          //                     className="app-about-text"
          //                     dangerouslySetInnerHTML={{
          //                       __html: author.aboutMe,
          //                     }}
          //                   ></p>
          //                 ) : (
          //                   <p className="app-about-text-not-yet">
          //                     {author.nickname} has not yet written anything about himself.
          //                   </p>
          //                 )}
          //               </div>
          //               <AuthorMessagesForm authorId={uid} />
          //               <MessagesList authorId={uid} showReplyForm={false} />
          //             </>
          //           )}

          //           {activeTab === 'posts' && (
          //             <ul className="app-post-list">
          //               {authorPosts.length > 0 ? (
          //                 authorPosts.map((post) => (
          //                   <li className="app-post-item" key={post.id}>
          //                     <Link to={`/post/${post.id}`} className="app-post-link">
          //                       <div className="app-post-image">
          //                         {post.media && post.media.length > 0 && (
          //                           <img src={post.media[0]} alt="Post" />
          //                         )}
          //                       </div>
          //                       <div className="app-post-content">
          //                         <p className="app-post-date">
          //                           {new Date(post.createdAt).toLocaleDateString()}
          //                         </p>
          //                         <h3 className="app-post-title">{post.title}</h3>
          //                         <p className="app-post-text">{post.text}</p>
          //                       </div>
          //                     </Link>
          //                   </li>
          //                 ))
          //               ) : (
          //                 <p className="app-post-no-posts">No posts yet</p>
          //               )}
          //             </ul>
          //           )}
          //         </div>
          //       </div> */}
          //     </>
          //   ) : isTablet ? (
          //     <div className="container">
          //       {/* <div className="app-info">
          //         <div className="app-avatar-img">
          //           <img
          //             src={author.avatar || avatarPlaceholder}
          //             alt={`${author.nickname}'s avatar`}
          //           />
          //         </div>

          //         <div className="app-cover">
          //           {author.cover && <img src={author.cover} alt={`${author.cover}'s`} />}
          //         </div>

          //         <div className="app-social">
          //           {(author.facebook || author.instagram || author.telegram) && (
          //             <p className="app-contacts">Contacts:</p>
          //           )}
          //           {author.facebook && (
          //             <a href={author.facebook} target="_blank" rel="noopener noreferrer">
          //               <img src={facebook} alt="facebook" />
          //             </a>
          //           )}
          //           {author.instagram && (
          //             <a href={author.instagram} target="_blank" rel="noopener noreferrer">
          //               <img src={instagram} alt="instagram" />
          //             </a>
          //           )}
          //           {author.telegram && (
          //             <a href={author.telegram} target="_blank" rel="noopener noreferrer">
          //               <img src={telegram} alt="telegram" />
          //             </a>
          //           )}
          //         </div>

          //         <h1 className="app-nickname">{author.nickname}</h1>

          //         <div className="app-line-box">
          //           <div></div>
          //         </div>
          //         <ul className="app-status">
          //           <li className="app-item">
          //             <p>
          //               Country: <span>{author.country}</span>
          //             </p>
          //           </li>
          //           <li className="app-item">
          //             <p>
          //               Status on the site: <span>{author.profession}</span>
          //             </p>
          //           </li>
          //         </ul>
          //       </div>

          //       <div className="app-tabs">
          //         <button
          //           className={`app-tabs-btn ${activeTab === 'about' ? 'app-tabs-btn-active' : ''}`}
          //           onClick={() => setActiveTab('about')}
          //         >
          //           <LiaIdCardSolid size={24} /> About
          //         </button>
          //         {author.createdPosts.length === 0 ? (
          //           <></>
          //         ) : (
          //           <button
          //             className={`app-tabs-btn ${
          //               activeTab === 'posts' ? 'app-tabs-btn-active' : ''
          //             }`}
          //             onClick={() => setActiveTab('posts')}
          //           >
          //             <HiOutlineClipboardDocumentList size={24} /> Posts (
          //             {author.createdPosts.length})
          //           </button>
          //         )}
          //       </div>

          //       <div className="profile-tabs-content">
          //         {activeTab === 'about' && (
          //           <div className="app-about">
          //             <h2 className="app-about-title">About author</h2>
          //             {stripHtml(author.aboutMe).trim() ? (
          //               <p
          //                 className="app-about-text"
          //                 dangerouslySetInnerHTML={{
          //                   __html: author.aboutMe,
          //                 }}
          //               ></p>
          //             ) : (
          //               <p className="app-about-text-not-yet">
          //                 {author.nickname} has not yet written anything about himself.
          //               </p>
          //             )}
          //             <AuthorMessagesForm authorId={uid} />
          //             <MessagesList authorId={uid} showReplyForm={false} />
          //           </div>
          //         )}

          //         {activeTab === 'posts' && (
          //           <ul className="app-post-list">
          //             {authorPosts.length > 0 ? (
          //               authorPosts.map((post) => (
          //                 <li className="app-post-item" key={post.id}>
          //                   <Link to={`/post/${post.id}`} className="app-post-link">
          //                     <div className="app-post-image">
          //                       {post.media && post.media.length > 0 && (
          //                         <img src={post.media[0]} alt="Post" />
          //                       )}
          //                     </div>
          //                     <div className="app-post-content">
          //                       <p className="app-post-date">
          //                         {new Date(post.createdAt).toLocaleDateString()}
          //                       </p>
          //                       <h3 className="app-post-title">{post.title}</h3>
          //                       <p className="app-post-text">{post.text}</p>
          //                     </div>
          //                   </Link>
          //                 </li>
          //               ))
          //             ) : (
          //               <p className="app-post-no-posts">No posts yet</p>
          //             )}
          //           </ul>
          //         )}
          //       </div> */}
          //     </div>
          //   ) : (
          <div className="profile">
            <CardProfile
              avatar={author.avatar}
              nickname={author.nickname}
              cover={author.cover}
              facebookLink={author.facebook}
              instagramLink={author.instagram}
              telegramLink={author.telegram}
              country={author.country}
              profession={author.profession}
              showSettings={false}
            />

            <TabsAuthor activeTab={activeTab} setActiveTab={setActiveTab} author={author} />

            <>
              {activeTab === 'about' && (
                <AboutAuthor
                  stripHtml={stripHtml}
                  author={author}
                  authorId={uid}
                  showReplyForm={false}
                />
              )}
            </>

            {/* <div className="container">
                  <div className="profile-tabs-content">
                    {activeTab === 'about' && (
                      <div className="app-about">
                        <h2 className="app-about-title">About author</h2>
                        {stripHtml(author.aboutMe).trim() ? (
                          <p
                            className="app-about-text"
                            dangerouslySetInnerHTML={{
                              __html: author.aboutMe,
                            }}
                          ></p>
                        ) : (
                          <p className="app-about-text-not-yet">
                            {author.nickname} has not yet written anything about himself.
                          </p>
                        )}
                        <AuthorMessagesForm authorId={uid} />
                        <MessagesList authorId={uid} showReplyForm={false} />
                      </div>
                    )}

                    {activeTab === 'posts' && (
                      <ul className="app-post-list">
                        {authorPosts.length > 0 ? (
                          authorPosts.map((post) => (
                            <li className="app-post-item" key={post.id}>
                              <Link to={`/post/${post.id}`} className="app-post-link">
                                <div className="app-post-image">
                                  {post.media && post.media.length > 0 && (
                                    <img src={post.media[0]} alt="Post" />
                                  )}
                                </div>
                                <div className="app-post-content">
                                  <p className="app-post-date">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                  </p>
                                  <h3 className="app-post-title">{post.title}</h3>
                                  <p className="app-post-text">{post.text}</p>
                                </div>
                              </Link>
                            </li>
                          ))
                        ) : (
                          <p className="app-post-no-posts">No posts yet</p>
                        )}
                      </ul>
                    )}
                  </div>
                </div> */}
          </div>
        ) : (
          // )}
          // </>
          <Loader />
        )}
      </div>
      <PopularPosts />
    </>
  );
};

export default AuthorProfilePage;
