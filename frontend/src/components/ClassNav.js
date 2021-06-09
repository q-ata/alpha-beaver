import React from "react";
import "../styles/classnav.css";

const tempIcon = "https://static.thenounproject.com/png/205610-200.png";

const ClassNav = () => {
  return (
    <div className="class-nav icon-group">
      <div className="icon instructors"><div className="icon-container"><img src={tempIcon} align="middle"></img><span>Instructors</span></div></div>
      <div className="icon contact"><div className="icon-container"><img src={tempIcon} align="middle"></img><span>Contact</span></div></div>
      <div className="icon grades"><div className="icon-container"><img src={tempIcon} align="middle"></img><span>Grades</span></div></div>
      <div className="icon content"><div className="icon-container"><img src={tempIcon} align="middle"></img><span>Content</span></div></div>
      <div className="icon forums"><div className="icon-container"><img src={tempIcon} align="middle"></img><span>Forums</span></div></div>
      <div className="icon classroom"><div className="icon-container"><img src={tempIcon} align="middle"></img><span>Classroom</span></div></div>
    </div>
  );
};

export default ClassNav;