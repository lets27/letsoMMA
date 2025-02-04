import "./nav.css";
import boxing from "../../assets/boxingGlove.png";
const LandingNav = () => {
  return (
    <nav className="navbar">
      {/* Logo on the far left */}
      <div className="logo">
        <span>
          FIGHT NO FLIGHT <img src={boxing} alt="" />
        </span>
      </div>
    </nav>
  );
};

export default LandingNav;
