import { useState } from "react";
import "./form.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../navbar/navbar";

const PostForm = () => {
  const token = localStorage.getItem("waguan");

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    file: null,
    isPrivate: false, // new state for the checkbox
  });
  const [overlay, setOverlay] = useState(false);
  const changeHandler = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : files ? files[0] : value, // handle checkbox, files, and regular inputs
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOverlay(true);
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("file", formData.file);
    formDataToSend.append("isPrivate", formData.isPrivate.toString()); // append the checkbox value as a string

    try {
      const response = await fetch("http://localhost:3000/official/newpost", {
        method: "POST",
        mode: "cors",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formDataToSend, // no need for JSON.stringify
      });
      if (!response.ok) {
        throw new Error("Error: cannot fetch data");
      }
      const data = await response.json();
      console.log(data);

      navigate("/official");
    } catch (error) {
      alert(error.message);
    } finally {
      setOverlay(false);
    }
  };

  return (
    <>
      <Navbar />

      <Link to="/official" className="link">
        Home
      </Link>
      {overlay && (
        <div className="overlay">
          <div className="spinner">
            <div className="spinnerin"></div>
          </div>
        </div>
      )}
      <div className="form-container">
        <h1>Create New Post</h1>
        <form id="newPostForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="postTitle">Title:</label>
            <input
              type="text"
              id="postTitle"
              name="title"
              placeholder="Enter your post title"
              onChange={changeHandler}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="postContent">Content:</label>
            <textarea
              id="postContent"
              name="content"
              placeholder="Write your blog post here..."
              rows="10"
              onChange={changeHandler}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="file">image:</label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={changeHandler}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="isPrivate">Private:</label>
            <input
              type="checkbox"
              id="isPrivate"
              name="isPrivate"
              onChange={changeHandler}
            />
          </div>

          <button type="submit" className="postBtn">
            Post
          </button>
        </form>
      </div>
    </>
  );
};

export default PostForm;
