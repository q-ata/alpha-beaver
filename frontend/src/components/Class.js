import {React, useState, useEffect} from "react";
import PropTypes from "prop-types";
import Navigation from "./Navigation";
import EventCalendar from "./Calendar";
import ClassNav from "./ClassNav";
import Announcement from "./Announcement";
import "../styles/class.css";
import Client from "./beaverjs";
const client = new Client();

const announceStyle = {
  textAlign: "left",
  float: "left",
  fontSize: "18px",
  color: "#111"
};

const Class = ({match}) => {
  const classID = match.params.classID;
  const [announces, setAnnounces] = useState([]);
  const [classInfo, setClassInfo] = useState({});
  
  useEffect(() => {
    client.getAnnouncements(classID).then(setAnnounces);
    client.getClass(classID).then(setClassInfo);
  }, []);

  return (
    <div className="course-page">
      <div className="big-box">
        <div className="header">
          {classInfo.name}
        </div>
        <Navigation />
        <div className="middle-section">
          <ClassNav />
          <div className="outline-box">
            <div className="outline-title">Course Outline</div>
            <div className="outline">{classInfo.desc}</div>
          </div>

          <div className="announcements">
            <div className="announcements-title">
              <div className="sort-button">
                <span className="sort-header">Sort By</span>
                <div className="sort-options">
                  <div className="sort-option" onClick={() => setAnnounces(announces.slice(0).sort((a, b) => Number(b.date) - Number(a.date)))}>
                    <span>Newest</span>
                  </div>
                  <div className="sort-option" onClick={() => setAnnounces(announces.slice(0).sort((a, b) => Number(a.date) - Number(b.date)))}>
                    <span>Oldest</span>
                  </div>
                </div>
              </div>
              <div className="announce-header">Announcements</div>
            </div>
            <ul className="announces">
              {announces.map((a) => <Announcement key={a.date} textStyle={announceStyle} title={a.title} clazz={classID} date={a.date} content={a.content} />)}
            </ul>
          </div>
        </div>
        <div className="to-do-wrapper">
          <div className="to-do-bar">
            <div className="calendar">
              <div className="to-do-title">Calender</div>
              <EventCalendar height="350px" fontSize="10px" />
            </div>
            <div className="to-do-list">
              <div className="to-do-title">
                {/* TODO: todo list (hehe) */}
                To-Do List
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Class.propTypes = {
  match: PropTypes.object.isRequired
};

export default Class;
