import React from "react";
import {useEffect, useState} from "react";
import Course from "./Course";
import Announcement from "./Announcement";
import EventCalendar from "./Calendar";
import Navigation from "./Navigation";
import "../styles/dashboard.css";
import Client from "./beaverjs";

const announceStyle = {
  textOverflow: "ellipsis",
  wordWrap: "break-word",
  overflow: "hidden",
  lineHeight: "1.2rem",
  fontSize: "0.9rem",
  display: "inline-block"
};

const Dashboard = () => {
  
  const [courses, setCourses] = useState([]);
  const [announces, setAnnounces] = useState([]);
  const [pfp, setPfp] = useState("");

  const loadAll = async () => {
    // TODO: Redo this with .then
    const client = new Client();
    const u = await client.me();
    setPfp(u.pfp);
    const classes = await client.getCourses();
    const ann = await client.getAnnouncements();
    setCourses(classes.map((c) => <Course key={c.name} name={c.name} desc={c.desc} background={c.background} color={c.color} cid={c.id} />));
    // TODO: Make finding the corresponding class more efficient.
    setAnnounces(ann.sort((a, b) => b.date - a.date).map((a) => <Announcement textStyle={announceStyle} key={a.date} clazz={classes.find((c) => c.id === a.class).name} title={a.title} date={a.date} content={a.content} />));
  };
  useEffect(() => {
    loadAll();
  }, []);
  
  return (

    <div className="dash-page">
      <Navigation />
      <div className="content-wrapper">
        <div className="area-wrapper">
          <div className="content-area">
            <div className="content">
              <div className="dashboard">
                <div className="page-header">
                  <h1 className="header"><span>Dashboard</span></h1>
                  <div className="header-actions">
                    <span>
                      <button style={{backgroundImage: `url("${pfp}")`}}></button>
                    </span>
                  </div>
                </div>
              </div>

              <div className="cards">

                {courses}
              
              </div>
            </div>
          </div>
          <div className="rs-bar">
            <EventCalendar height="350px" fontSize="10px" />
            <div className="announcements">
              <div className="announce-header">
                <span>Announcements</span>
              </div>

              <ul className="announcements-list">
                {announces}
              </ul>

              <div className="announce-show-all">
                <button>Show All</button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;