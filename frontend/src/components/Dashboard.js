import React from "react";
import {useEffect, useState} from "react";
import Course from "./Course";
import Announcement from "./Announcement";
import "../styles/dashboard.css";
import Cookies from "js-cookie";
import profileIcon from "../resources/profile.svg";
import announcementsIcon from "../resources/announcement.svg";
import coursesIcon from "../resources/courses.svg";
import calendarIcon from "../resources/calendar.svg";


const getCourses = async (token) => {
  const url = new URL("http://localhost:8000/api/classes");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const obj = await res.json();
  return obj.classes;
};


const getAnnouncements = async (token) => {
  const url = new URL("http://localhost:8000/api/announcements");

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const obj = await res.json();
  return obj.announcements;
};

const Dashboard = () => {

  const [courses, setCourses] = useState([]);
  const [announces, setAnnounces] = useState([]);

  const loadAll = async () => {
    const token = Cookies.get("auth_token");
    // TODO: Check for expired or missing token and try to apply refresh token.
    const classes = await getCourses(token);
    const ann = await getAnnouncements(token);
    console.log(classes);
    setCourses(classes.map((c) => <Course key={c.name} name={c.name} desc={c.desc} background={c.background} color={c.color} />));
    setAnnounces(ann.sort((a, b) => b.date - a.date).map((a) => <Announcement key={a.date} clazz={classes.find((c) => c.id === a.class).name} title={a.title} date={a.date} content={a.content} />));
  };
  useEffect(() => {
    loadAll();
  }, []);
  
  return (

    <div className="dash-page">
      <header className="nav-section">
        <div className="main-nav">
          <div className="corner-icon">
          </div>
          <ul className="nav-bar">
            <li className="nav-item">
              <button className="nav-item-button">
                <div className="nav-item-icon">
                  <img src={coursesIcon} alt="" />
                </div>
                <div className="nav-item-caption">
                  Courses
                </div>
              </button>
            </li>
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
      <div className="content-wrapper">
        <div className="area-wrapper">
          <div className="content-area">
            <div className="content">
              <div className="dashboard">
                <div className="page-header">
                  <h1 className="header"><span>Dashboard</span></h1>
                  <div className="header-actions">
                    <span>
                      <button></button>
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
            <div className="calendar">
              <img src="https://cdn.vertex42.com/calendars/2021/April-2021-calendar.png" alt="calendar" />
            </div>
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