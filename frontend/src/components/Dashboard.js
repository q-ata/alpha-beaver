import React from "react";
import {useEffect, useState} from "react";
import Course from "./Course";
import Announcement from "./Announcement";
import EventCalendar from "./Calendar";
import Navigation from "./Navigation";
import "../styles/dashboard.css";
import Cookies from "js-cookie";

const getUser = async (token) => {
  const url = new URL("http://localhost:8000/api/users/me");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const obj = await res.json();
  return obj;
};

const getCourses = async (token) => {
  const url = new URL("http://localhost:8000/api/users/me/classes");
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
  const url = new URL("http://localhost:8000/api/users/me/announcements");

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
    const u = await getUser(token);
    console.log(u);
    const classes = await getCourses(token);
    const ann = await getAnnouncements(token);
    setCourses(classes.map((c) => <Course key={c.name} name={c.name} desc={c.desc} background={c.background} color={c.color} />));
    setAnnounces(ann.sort((a, b) => b.date - a.date).map((a) => <Announcement key={a.date} clazz={classes.find((c) => c.id === a.class).name} title={a.title} date={a.date} content={a.content} />));
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