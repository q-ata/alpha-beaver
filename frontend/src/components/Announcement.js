import React from "react";
import {Text} from "react-native";
import PropTypes from "prop-types";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const Announcement = ({title, clazz, date, content}) => {

  date = new Date(date);
  return (
    <li className="announcement">
      <div className="announce-content">
        <div className="announce-title-container">
          <span className="announce-title">{title}</span>
        </div>
        <span className="announce-class">{clazz}</span><span className="announce-date">{`${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`}</span>
        <span className="announce-preview"><Text>{content}</Text></span>
      </div>
    </li>
  );

};

Announcement.propTypes = {
  title: PropTypes.string.isRequired,
  clazz: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired
};

export default Announcement;