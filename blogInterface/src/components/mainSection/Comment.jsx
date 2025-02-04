import "./modal.css";
import { useState, useEffect } from "react";
import useUser from "../../context/customHooks.js";
import { useRef } from "react";

const Comment = ({ detail }) => {
  const { postId, toggleModal, modal } = detail;
  const { user } = useUser(); // get user from context
  const token = localStorage.getItem("waguan");
  const [formData, setFormData] = useState({ comment: "" });
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const [overlay, setOverlay] = useState(false);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Fetch comments from the server
        const response = await fetch(
          `http://localhost:3000/official/comments/${postId}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if the response is ok
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        // Parse the JSON response
        const data = await response.json();
        setComments(data); // Set the comments to state
      } catch (err) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false); // Set loading to false when fetch is complete
      }
    };

    fetchComments();
  }, [postId, token]); // Dependency array - runs when postId changes

  //useeffect to toggle scrolling
  useEffect(() => {
    document.body.classList.toggle("no-scroll", modal); // Toggle scroll based on modal state
    return () => document.body.classList.remove("no-scroll"); // Cleanup class on unmount
  }, [modal]); // This effect runs whenever modal state changes

  //useEffect to target input focus
  useEffect(() => {
    if (modal && inputRef.current) {
      inputRef.current.focus(); // Focus the input field once modal is open
    }
  }, [modal]); // Focus the input whenever modal changes and is opened

  if (loading) {
    return <p>Loading comments...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const makeComment = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        throw new Error("Couldn't fetch token");
      }
      setOverlay(true);
      const response = await fetch(
        `http://localhost:3000/official/post/${postId}`,
        {
          method: "POST", // Use POST
          mode: "cors",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to post comment");
      }

      const comment = await response.json();
      console.log("Comment added:", comment);
      setFormData({ comment: "" }); // Clear the form after submitting
      toggleModal(); // Close modal after posting comment
    } catch (error) {
      console.error(error);
    } finally {
      setOverlay(false);
    }
  };

  return (
    <>
      {" "}
      {overlay && (
        <div className="overlay">
          <div className="spinner">
            <div className="spinnerin"></div>
          </div>
        </div>
      )}
      <div className="m">
        {" "}
        <div className="comment-list">
          <h3>Comments</h3>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <ul>
              {comments.map((comment) => (
                <li key={comment.commentId} className="comment">
                  <p>
                    <strong>@{comment.user.username}</strong>
                  </p>
                  <p>{comment.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p>Make a comment, {user.username}</p>
        <form>
          <input
            type="text"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            ref={inputRef}
            required
          />
          <button
            type="submit"
            onClick={makeComment}
            disabled={!formData.comment.trim()} // Disable submit button if comment is empty
          >
            comment
          </button>
        </form>
      </div>
    </>
  );
};

export default Comment;
