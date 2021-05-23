import React from 'react';
import {Link, useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import Course from "./Course";
import Announcement from "./Announcement";
import "../styles/dashboard.css";

const getCourses = async () => {
  const url = new URL("http://159.89.127.1:3000/api/user")
  // var params = {info:"courses"}
  // Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${123}`
    }
  })

  const obj = await res.json();
  return obj.classes;
}


const getAnnouncements = async () => {
  const url = new URL("http://159.89.127.1:3000/api/announcements")
  // var params = {info:"announcements"}
  // Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${123}`
    }
  });

  const obj = await res.json();
  return obj.announcements;
}



const Dashboard = () => {

  const [courses, setCourses] = useState([]);
  const [announces, setAnnounces] = useState([]);
  
  const loadAll = async () => {
    const classes = await getCourses();
    const ann = await getAnnouncements();
    setCourses(classes.map((c) => <Course name={c.name} desc={c.desc} img={c.img} />));
    setAnnounces(ann.map((a) => <Announcement course={a.course} announce={a.announces} date={a.date} />));
  }
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
                  <img src="" alt="" />
                </div>
                <div className="nav-item-caption">
                  Account
                </div>
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-item-button">
                <div className="nav-item-icon">
                  <img src="" alt="" />
                </div>
                <div className="nav-item-caption">
                  Dashboard
                </div>
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-item-button">
                <div className="nav-item-icon">
                  <img src="" alt="" />
                </div>
                <div className="nav-item-caption">
                  Courses
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
              <img src="" alt="calendar" />
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
}



export default Dashboard;