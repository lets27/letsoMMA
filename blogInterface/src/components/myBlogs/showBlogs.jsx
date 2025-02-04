import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";
import Blogs from "./blogs";
import "./showBlogs.css";
const ShowBlogs = () => {
  return (
    <div className="blogs-container">
      <div className="nav">
        <Navbar />
      </div>
      <Blogs />
      <Footer />
    </div>
  );
};

export default ShowBlogs;
