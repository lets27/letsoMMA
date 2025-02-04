import { useEffect, useRef, useState } from "react";

import "./signup.css";

const SignUp = ({ task }) => {
  const { toggleLogin } = task;
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [overlay, setOverlay] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handles input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOverlay(true);
    try {
      const response = await fetch("http://localhost:3000/public/signup", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create user. Please try again later.");
      }

      const data = await response.json();

      alert("Account created. Please login");

      console.log("User created successfully:", data);
    } catch (error) {
      setError(error);
    } finally {
      setOverlay(false);
    }
  };

  if (error) {
    return (
      <div>
        <h3>Error: {error.message}</h3>
      </div>
    );
  }

  return (
    <div>
      {" "}
      {overlay && (
        <div className="overlay">
          <div className="spinner">
            <div className="spinnerin"></div>
          </div>
        </div>
      )}
      <div className="signup-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              ref={inputRef}
              required
            />
          </div>
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
            Already signed up? Login
          </span>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
