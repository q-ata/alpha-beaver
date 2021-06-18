import {React} from "react";
import {Link} from "react-router-dom";
import profileIcon from "../resources/profile.svg";
import announcementsIcon from "../resources/announcement.svg";
import coursesIcon from "../resources/courses.svg";
import calendarIcon from "../resources/calendar.svg";
import "../styles/navigation.css";

const Navigation = () => {
  return (
    <header className="nav-section">
      <div className="main-nav">
        <div className="corner-icon">
        </div>
        <ul className="nav-bar">
          <Link to="/dashboard">
            <li className="nav-item">
              <button className="nav-item-button">
                <div className="nav-item-icon">
                  <img src={coursesIcon} alt="" />
                </div>
                <div className="nav-item-caption">
                  Dashboard
                </div>
              </button>
            </li>
          </Link>
          <li className="nav-item">
            <button className="nav-item-button">
              <div className="nav-item-icon">
                <img src={profileIcon} alt="" />
              </div>
              <div className="nav-item-caption">
                Account
              </div>
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-item-button">
              <div className="nav-item-icon">
                <img src={calendarIcon} alt="" />
              </div>
              <div className="nav-item-caption">
                Calendar
              </div>
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-item-button">
              <div className="nav-item-icon">
                <img src={announcementsIcon} alt="" />
              </div>
              <div className="nav-item-caption">
                Announcements
              </div>
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navigation;