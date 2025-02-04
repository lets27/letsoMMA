import "./landing.css";
import ufc from "../../assets/ufc.mp4";
import LandingNav from "./landingNavbar";
import Intro from "./intro";
import Footer from "../footer/footer";
import { useState } from "react";

const LandingPage = () => {
  return (
    <div className="landing">
      <LandingNav />
      <div className="video">
        <video className="background  text-fade" autoPlay loop muted>
          <source src={ufc} />
        </video>
      </div>
      <Intro />
      <Footer />
    </div>
  );
};

export default LandingPage;
