import { Link } from "react-router-dom";
import "./errorStyle.css";
import useUser from "../context/customHooks";

function ErrorPage() {
  const { user } = useUser();
  return (
    <div className="error-container">
      <h1>404</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      {user ? (
        <Link to="/official" className="home-link">
          Go Back Home
        </Link>
      ) : (
        <Link to="/" className="home-link">
          Go Back Home
        </Link>
      )}
    </div>
  );
}

export default ErrorPage;
