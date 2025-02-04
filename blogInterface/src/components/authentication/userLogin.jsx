import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../../context/customHooks.js";
import "./signup.css";

const UserLogin = ({ task }) => {
  console.log("UserLogin task prop:", task);

  const { toggleLogin } = task;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [overlay, setOverlay] = useState(false);
  const { setUser } = useUser();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOverlay(true);
    try {
      const response = await fetch("http://localhost:3000/public/login", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Server failed to login, try again");
      }

      const data = await response.json();
      const token = data.token;
      const user = data.user;

      if (token) {
        localStorage.setItem("waguan", token);
        navigate("/official");
        setUser(user);
      } else {
        throw new Error("Token not received. Login failed.");
      }
    } catch (error) {
      setError(error);
    } finally {
      setOverlay(false);
    }
  };

  if (error) {
    alert(error.message);
  }

  return (
    <>
      {overlay && (
        <div className="overlay">
          <div className="spinner">
            <div className="spinnerin"></div>
          </div>
        </div>
      )}
      <div className="signup-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>
          <span className="log" onClick={() => toggleLogin()}>
            Sign Up
          </span>
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
};

export default UserLogin;
