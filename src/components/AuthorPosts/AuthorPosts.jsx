import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import InfoBoard from '../InfoBoard/InfoBoard';

const AuthorPosts = ({ authorPosts, author }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1259px)' });

  return (
    <div className="container">
      <ul className="posts-grid">
        {authorPosts.length > 0 ? (
          authorPosts.map((post) => (
            <li
              className="grid"
              key={post.id}
              style={{ height: isTablet || isMobile ? '445px' : '540px' }}
            >
              <Link to={`/post/${post.id}`}>
                <div className="grid-header">
                  <div className="grid-avatar avatarLarge">
                    {author.avatar && <img src={author.avatar} alt="Author" />}
                  </div>
                  <div className="grid-info-post">
                    <p className="nicknameText">{post.author.nickname}</p>
                    <p className="dateText">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid-content"></div>

                <div className="grid-image">
                  {post.media && post.media.length > 0 && <img src={post.media[0]} alt="Post" />}
                </div>
                <div className="grid-box-text">
                  <p className="grid-title postTitle">{post.title}</p>
                  <p className="grid-text nicknameText">{post.text}</p>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <InfoBoard message={'No posts yet'} />
        )}
      </ul>
    </div>
  );
};

export default AuthorPosts;
