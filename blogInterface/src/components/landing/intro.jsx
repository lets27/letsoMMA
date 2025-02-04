import { useState } from "react";
import SignUp from "../authentication/signup";
import "./intro.css";
import UserLogin from "../authentication/userLogin";

const Intro = () => {
  const [login, setLogin] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleLogin = () => {
    setLogin(!login);
  };

  const toggleOpen = () => {
    setOpen(!open);
  };

  console.log("login:", login);
  return (
    <div className="remarks">
      <h2>WELCOME TO MMA FAN CLUB</h2>
      <h3>
        Read all about the latest events and inside scoops
        <br /> and make your opinion known
      </h3>
      <button className="btn" onClick={toggleOpen}>
        Join Us
      </button>
      {open && (
        <div className="overlay" onClick={toggleOpen}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {login && open ? (
              <UserLogin task={{ toggleLogin: toggleLogin }} />
            ) : (
              <SignUp task={{ toggleLogin: toggleLogin }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Intro;
