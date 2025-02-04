import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import comment from "../../assets/comment.png"; // Adjust the path if needed
import Comment from "../mainSection/Comment"; // Adjust the path if needed

import "./blogs.css";
const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [activePostId, setActivePostId] = useState(null); // Track the active post for the modal
  const token = localStorage.getItem("waguan");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        if (!token) {
          throw new Error("Couldn't fetch token");
        }

        const response = await fetch("http://localhost:3000/official/blogs", {
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
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getAllPosts();
  }, [token, loading]);
  const toggleModal = (postId) => {
    setActivePostId(activePostId === postId ? null : postId); // Toggle modal for specific post
  };
  if (loading) {
    return (
      <>
        <h3>loading comments</h3>
      </>
    );
  }
  return (
    <div className="myBlogs-content">
      <h3>My blogs</h3>
      <ul>
        {posts.map((post) => (
          <li key={post._id} className="myBlogs-item">
            <img
              className="myBlogs-postImage"
              src={post.imageUrl || "defaultImageUrl.jpg"}
              alt="Post visual"
            />

            {/* Post Details */}
            <div className="myBlogs-postDetails">
              <h3 className="myBlogs-postTitle">{post.title}</h3>
              <p className="myBlogs-timestamp">
                {new Date(post.createdAt).toLocaleString()}
              </p>

              <p className="myBlogs-postContent">{post.postContent}</p>
              {/* See More Link */}
              <div className="myBlogs-seeMore">
                <Link to={`/details/${post._id}`} state={post}>
                  See more
                </Link>
              </div>
            </div>

            {/* Conditional Modal */}
            {activePostId === post._id && (
              <>
                <div
                  className="myBlogs-modal-overlay"
                  onClick={(e) => {
                    // Ensure the click is on the overlay (not inside the modal container)
                    if (e.target === e.currentTarget) {
                      toggleModal(post.post_id); // Close the modal when the overlay is clicked
                    }
                  }}
                ></div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Blogs;
