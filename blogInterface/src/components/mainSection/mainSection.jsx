import "./mainsec.css";
import comment from "./comment.png";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Comment from "./Comment.jsx";

const MainSection = () => {
  const [posts, setPosts] = useState([]);
  const [activePostId, setActivePostId] = useState(null); // Track the active post for the modal
  const [overlay, setOverlay] = useState(false);
  const token = localStorage.getItem("waguan");

  const toggleModal = (postId) => {
    setActivePostId(activePostId === postId ? null : postId); // Toggle modal for specific post
  };

  useEffect(() => {
    setOverlay(true);
    const getAllPosts = async () => {
      try {
        if (!token) {
          throw new Error("Couldn't fetch token");
        }

        const response = await fetch("http://localhost:3000/official/posts", {
          method: "GET",
          mode: "cors",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Could not retrieve posts");
        }

        const posts = await response.json();
        const sortedPosts = posts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error(error);
      } finally {
        setOverlay(false);
      }
    };

    getAllPosts();
  }, [token]);

  return (
    <div className="content">
      {overlay && (
        <div className="overlay">
          <div className="spinner">
            <div className="spinnerin"></div>
          </div>
        </div>
      )}
      <ul>
        {posts.map((post) => (
          <li key={post._id} className="item">
            <img
              className="postImage"
              src={post.imageUrl || "defaultImageUrl.jpg"}
              alt="Post visual"
            />

            {/* Post Details */}
            <div className="postDetails">
              <h3 className="postTitle">{post.title}</h3>
              <p className="timestamp">
                {new Date(post.createdAt).toLocaleString()}
              </p>

              <p className="postContent">{post.postContent}</p>
              {/* See More Link */}
              <div className="seeMore">
                <Link to={`/details/${post._id}`} state={post}>
                  See more
                </Link>
              </div>
            </div>

            {/* Post Actions */}
            <div className="buttons">
              <ul>
                <li>
                  <img
                    onClick={() => toggleModal(post._id)}
                    src={comment} // Assuming `comment` is the comment icon or button
                    alt="Comment"
                  />
                </li>
              </ul>
            </div>

            {/* Conditional Modal */}
            {activePostId === post._id && (
              <>
                <div
                  className="modal-overlay"
                  onClick={() => toggleModal(post._id)}
                ></div>
                <div className="modal-container">
                  <Comment
                    detail={{
                      postId: post._id,
                      modal: true,
                      toggleModal,
                    }}
                  />
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default MainSection;
