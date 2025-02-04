import "./nav.css";
import { Link, useNavigate } from "react-router-dom";
import boxing from "../../assets/boxingGlove.png";
const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove JWT from localStorage
    localStorage.removeItem("waguan");

    // Redirect to /home
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Link to={`/official`}>
            <span>
              FIGHT NO FLIGHT <img src={boxing} alt="" />
            </span>
          </Link>
        </div>
        <div className="links">
          <ul>
            <li>
              <Link to={`/official`}>home</Link>
            </li>
            <li>
              <Link to={`/postform`}>New Post</Link>
            </li>
            <li>
              <Link to={`/myblogs`}>my blogs</Link>
            </li>
            <li className="logout" onClick={handleLogout}>
              Logout
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
