import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { fetchAuthorData, fetchAuthorPosts } from '../../utils/authorUtils';
import { stripHtml } from '../../utils/textUtils';

import CardProfile from '../../components/CardProfile/CardProfile';
import TabsAuthor from '../../components/TabsAuthor/TabsAuthor';
import AboutAuthor from '../../components/AboutAuthor/AboutAuthor';
import Loader from '../../components/Loader';
import PopularPosts from '../../components/PopularPosts/PopularPosts';
import AuthorPosts from '../../components/AuthorPosts/AuthorPosts';

const AuthorProfilePage = () => {
  const { uid } = useParams();
  const [author, setAuthor] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [authorPosts, setAuthorPosts] = useState([]);

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
      {author ? (
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

            {activeTab === 'posts' && <AuthorPosts authorPosts={authorPosts} author={author} />}
          </>
        </div>
      ) : (
        <Loader />
      )}

      <PopularPosts />
    </>
  );
};

export default AuthorProfilePage;
