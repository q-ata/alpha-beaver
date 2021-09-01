import React from "react";
import PropTypes from "prop-types";
import {useHistory} from "react-router-dom";
import "../styles/classnav.css";
import HomeIcon from "@material-ui/icons/Home";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import PublishIcon from "@material-ui/icons/Publish";
import AssessmentIcon from "@material-ui/icons/Assessment";
import InfoIcon from "@material-ui/icons/Info";
import ContactMailIcon from "@material-ui/icons/ContactMail";

const ClassNav = ({classID}) => {
  const h = useHistory();
  return (
    <div className="class-nav icon-group">
      <div className="icon home">
        <div className="icon-container" onClick={() => h.push(`/class/${classID}`)}><HomeIcon /><span>Home</span></div>
      </div>
      <div className="icon content">
        <div className="icon-container" onClick={() => h.push(`/class/${classID}/content`)}><MenuBookIcon /><span>Content</span></div>
      </div>
      <div className="icon submit">
        <div className="icon-container" onClick={() => h.push(`/class/${classID}/submit`)}><PublishIcon /><span>Submit</span></div>
      </div>
      <div className="icon grades">
        <div className="icon-container" onClick={() => h.push(`/class/${classID}/grades`)}><AssessmentIcon /><span>Grades</span></div>
      </div>
      <div className="icon about">
        <div className="icon-container" onClick={() => h.push(`/class/${classID}/about`)}><InfoIcon /><span>About</span></div>
      </div>
      <div className="icon contact">
        <div className="icon-container" onClick={() => h.push(`/class/${classID}/contact`)}><ContactMailIcon /><span>Contact</span></div>
      </div>
    </div>
  );
};
ClassNav.propTypes = {
  classID: PropTypes.string.isRequired
};

export default ClassNav;