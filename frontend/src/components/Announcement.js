import React from "react";
import PropTypes from "prop-types";

const Announcement = ({course, announce, date}) => {

  return (
    <li className="announcement">
      <div className="announce-content">
        <div className="announce-title-container">
          <span className="announce-title">{course}</span>
        </div>
        <span className="announce-date">{date}</span>
        <span className="announce-preview">{announce[0]}</span>
      </div>
    </li>
  );

};

Announcement.propTypes = {
  course: PropTypes.string.isRequired,
  announce: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired
};

export default Announcement;