import {React} from "react";
import {Link} from "react-router-dom";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import EventIcon from "@material-ui/icons/Event";
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
                  <DashboardIcon />
                </div>
                <div className="nav-item-caption">
                  Dashboard
                </div>
              </button>
            </li>
          </Link>
          <Link to="/upcoming">
            <li className="nav-item">
              <button className="nav-item-button">
                <div className="nav-item-icon">
                  <EventIcon />
                </div>
                <div className="nav-item-caption">
                  Upcoming
                </div>
              </button>
            </li>
          </Link>
          <Link to="/">
            <li className="nav-item">
              <button className="nav-item-button">
                <div className="nav-item-icon">
                  <AnnouncementIcon />
                </div>
                <div className="nav-item-caption">
                  Announcements
                </div>
              </button>
            </li>
          </Link>
          <Link to="/">
            <li className="nav-item">
              <button className="nav-item-button">
                <div className="nav-item-icon">
                  <AccountBoxIcon />
                </div>
                <div className="nav-item-caption">
                  Account
                </div>
              </button>
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Navigation;