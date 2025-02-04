import MainSection from "./mainSection/mainSection";
import Navbar from "./navbar/navbar";
import "../App.css";
import "./parent.css";

const Parent = () => {
  return (
    <div className="parent-container">
      <Navbar />
      <MainSection />
    </div>
  );
};

export default Parent;
