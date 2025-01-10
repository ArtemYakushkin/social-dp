import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase";
import Loader from "../components/Loader";

const AuthorProfile = () => {
  const { uid } = useParams();
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      const authorRef = doc(db, "users", uid);
      const docSnap = await getDoc(authorRef);

      if (docSnap.exists()) {
        setAuthor(docSnap.data());
      } else {
        console.error("No such user!");
      }
    };

    fetchAuthorData();
  }, [uid]);

  return (
    <div>
      {author ? (
        <div>
          <h1>{author.nickname}</h1>
          <img src={author.avatar} alt={`${author.nickname}'s avatar`} />
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default AuthorProfile;
