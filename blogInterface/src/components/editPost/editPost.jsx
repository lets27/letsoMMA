import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./edit.css";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

const EditForm = () => {
  const location = useLocation();
  const post = location.state; // Assumes `post` is passed through `state`
  const token = localStorage.getItem("waguan");
  const postid = post._id;
  const [overlay, setOverlay] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: post.title || "",
    content: post.postContent || "",
    file: null,
  });

  const changeHandler = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }
    console.log(formDataToSend);
    try {
      //send overlay before submission
      setOverlay(true);
      const response = await fetch(
        `http://localhost:3000/official/post/${postid}`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            authorization: `Bearer ${token}`,
          },
          body: formDataToSend, // Send FormData directly
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the post.");
      }

      const data = await response.json();

      // alert("Post updated successfully!");

      navigate("/official");
      console.log("Response data:", data);
      return data;
    } catch (error) {
      alert(error.message);
    } finally {
      setOverlay(false);
    }
  };

  return (
    <>
      {overlay && (
        <div className="overlay">
          <div className="spinner">
            <div className="spinnerin"></div>
          </div>
        </div>
      )}
      <Navbar />
      <br />
      <br />
      <br />
      <br />
      <div className="form-container">
        <Link to="/postform">New Post</Link>
        <h1>Edit Post</h1>
        <form id="editPostForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="postTitle">Title:</label>
            <input
              type="text"
              id="postTitle"
              name="title"
              placeholder="Enter your post title"
              value={formData.title}
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
              value={formData.content}
              onChange={changeHandler}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              name="file"
              onChange={changeHandler}
            />
          </div>

          <button type="submit" className="btn">
            Update Post
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default EditForm;
