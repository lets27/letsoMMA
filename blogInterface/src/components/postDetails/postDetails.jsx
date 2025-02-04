import "./details.css";
import insta from "./instagram.png";
import fb from "./facebook.png";
import check from "./check.png";
import tiktok from "./tiktok.png";
import comment from "./comment.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useUser from "../../context/customHooks.js";
import { useState } from "react";
import ShowComments from "./showComments.jsx";
import Navbar from "../navbar/navbar.jsx";
import bin from "../../assets/bin.png";
import Footer from "../footer/footer.jsx";
const PostDetails = () => {
  const locaton = useLocation();
  const post = locaton.state;
  const postid = post._id;
  const token = localStorage.getItem("waguan");

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useUser(); //user context
  const [overlay, setOverlay] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const deletePost = async (e) => {
    e.preventDefault();
    setOverlay(true);
    try {
      const response = await fetch(
        `http://localhost:3000/official/post/${postid}`,
        {
          method: "DELETE",
          mode: "cors",
          headers: { authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("error cannot fetch data");
      }
      const data = await response.json();
      navigate("/official");
      return data;
    } catch (error) {
      alert(error.message);
    } finally {
      setOverlay(false);
    }
  };

  if (loading) {
    return (
      <>
        <h3>loading comments</h3>
      </>
    );
  }
  return (
    <>
      <Navbar />
      {overlay && (
        <div className="overlay">
          <div className="spinner">
            <div className="spinnerin"></div>
          </div>
        </div>
      )}
      <div className="details-container">
        <div className="details-header">
          <div className="details-intro">
            <p className="details-title">{post.title}</p>
            <div className="details-small-title">
              <span className="details-username">author: {user.username}</span>
              <img className="details-check" src={check} alt="Verified" />
            </div>
          </div>
          <div className="details-socials">
            <ul>
              <li>
                <img src={insta} alt="Instagram" />
              </li>
              <li>
                <img src={tiktok} alt="TikTok" />
              </li>
              <li>
                <img src={fb} alt="Facebook" />
              </li>
            </ul>
          </div>
          {user._id === post.authorId ? (
            <Link
              to={`/edit/${postid}`}
              state={post}
              className="details-delete-button"
            >
              edit
            </Link>
          ) : null}
        </div>

        <div className="details-postImage">
          <img src={post.imageUrl} alt="Post" />
        </div>

        <div className="details-content">
          <p>{post.postContent}</p>
        </div>
        <div className="theBtns">
          {user.id === post.authorId ? (
            <div className="details-delete-button" onClick={deletePost}>
              <img src={bin} alt="Delete" />
            </div>
          ) : null}
          <img
            src={comment}
            className="details-comment-icon"
            alt="Toggle comments"
            onClick={toggleOpen}
          />
        </div>
        {open && <ShowComments details={{ postid, toggleOpen }} />}
      </div>
      <Footer />
    </>
  );
};

export default PostDetails;
