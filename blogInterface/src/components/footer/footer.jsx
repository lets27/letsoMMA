import "./footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <p>Join the MMA Fan Club: Your ultimate source for everything MMA!</p>
      <div className="lists">
        <div className="left-side">
          <ul>
            <li>Contact: 123-456-7890</li>
            <li>Email: mmafanclub@gmail.com</li>
          </ul>
        </div>
        <div className="middle">
          <ul>
            <li>Upcoming Events</li>
            <li>Latest News</li>
            <li>Inside Stories</li>
          </ul>
        </div>
        <div className="right-side">
          <ul>
            <li>Fighter Profiles</li>
            <li>Event Tickets</li>
            <li>MMA Merchandise</li>
            <li>Fan Forum</li>
          </ul>
        </div>
      </div>
      <p className="copyright">© 2024 MMA Fan Club</p>
    </div>
  );
};

export default Footer;
