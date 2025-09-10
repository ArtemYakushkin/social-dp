import MessagesForm from '../MessagesForm/MessagesForm';

const AboutAuthor = ({ stripHtml, author, authorId }) => {
  return (
    <div className="container">
      <div className="me">
        <div className="me-header">
          <h2 className="tabsTitle">About author</h2>
        </div>
        {stripHtml(author.aboutMe).trim() ? (
          <p
            className="aboutMeText"
            dangerouslySetInnerHTML={{
              __html: author.aboutMe,
            }}
          ></p>
        ) : (
          <p className="aboutMeText">
            {author.nickname} has not yet written anything about himself.
          </p>
        )}
      </div>

      <MessagesForm authorId={authorId} />
      {/* <MessagesList authorId={authorId} showReplyForm={false} /> */}
    </div>
  );
};

export default AboutAuthor;
