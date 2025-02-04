import { useEffect, useState } from "react";
import "./showComments.css";
import useUser from "../../context/customHooks";

const ShowComments = ({ details }) => {
  console.log("dets", details);
  const { postid, toggleOpen } = details;

  const [comments, setComments] = useState();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("waguan");
  console.log("our id:", postid);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        if (!token) {
          throw new Error("Couldn't fetch token");
        }

        const response = await fetch(
          `http://localhost:3000/official/comments/${postid}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Could not retrieve comments");
        }

        const incomingComments = await response.json();
        setComments(incomingComments);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getAllPosts();
  }, [token, postid]);

  if (loading) {
    return (
      <>
        <h3>loading comments</h3>
      </>
    );
  }

  return (
    <div className="comment-holder">
      <span>comments</span>
      <div className="comment-container">
        {comments &&
          comments.map((comment) => (
            <div className="comment-item" key={comment.commentId}>
              <span>@{comment.user.username}</span>
              <p>{comment.content}</p>
            </div>
          ))}
      </div>
      <button className="comment-close-button" onClick={toggleOpen}>
        Close
      </button>
    </div>
  );
};

export default ShowComments;
