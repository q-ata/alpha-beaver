/* eslint-disable */
import React from 'react';
import {useEffect, useState} from "react";
import "../styles/class.css";
import "../styles/nav-bar.css";

const classInfo = {
    logo: "",   
    courseCode: "MCD101",
    title: "Mcdonalds Employee Training",
    outline: "Welcome to Mcdonalds! Through this course you will learn how to flip burgers and make icecream.",
    announcements: [
        {
            text: "First Announcement",
            date: "May 28, 2021"
        },
        {
            text: "Second Announcement",
            date: "May 29, 2021"
        },
        {
            text: "First Announcement",
            date: "May 30, 2021"
        }
    ],
    todo: [
        {
            assignment: "BTS Meal",
            link: "www.google.com",
            due: "May 31, 2021"
        },
        {
            assignment: "McChicken",
            link: "www.google.com",
            due: "June 5, 2021"
        }
    ]
}

const getClassInfo = async (course_id) => {
  const url = new URL(`http://159.89.127.1:3000/api/courses/${course_id}`)
  // var params = {info:"courses"}
  // Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${123}`
    }
  });

  const obj = await res.json();
  return obj.classInfo;
}

/*
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
*/

const tempIcon = "https://static.thenounproject.com/png/205610-200.png";

const Class = () => {

  // const [classInfo, setClassInfo] = useState([]);
  // const [announces, setAnnounces] = useState([]);
  
  const loadAll = async () => {
    const classes = await getClassInfo();
    //setClassInfo(classes.map((c) => <Course name={c.name} desc={c.desc} img={c.img} />));
    // const ann = await getAnnouncements();
    // setAnnounces(ann.map((a) => <Announcement course={a.course} announce={a.announces} date={a.date} />));
  }
  useEffect(() => {
    loadAll();
  }, []);

  console.log(classInfo.outline)
  

  const sortOptions = [
    { value: 'new', label: 'Newest'},
    { value: 'old', label: 'Oldest'}
  ]

  return (
    <div className="course-page">
      <header className="nav-section">
        <div className="main-nav">
          <div className="corner-icon">
          </div>
          <ul className="nav-bar">
            <li className="nav-item">
              <button className="nav-item-button">
                <div className="nav-item-icon">
                  <img src="https://q.utoronto.ca/images/messages/avatar-50.png" alt="" />
                </div>
                <div className="nav-item-caption">
                  Account
                </div>
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-item-button">
                <div className="nav-item-icon">
                  <img src="https://q.utoronto.ca/images/messages/avatar-50.png" alt="" />
                </div>
                <div className="nav-item-caption">
                  Dashboard
                </div>
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-item-button">
                <div className="nav-item-icon">
                  <img src="https://q.utoronto.ca/images/messages/avatar-50.png" alt="" />
                </div>
                <div className="nav-item-caption">
                  Courses
                </div>
              </button>
            </li>
          </ul>
        </div>
      </header>
          <div className="big-box">
            <div className="header">
               {classInfo.title} [{classInfo.courseCode}]
            </div>

            <div className="middle-section">
              <div className="outline-box">
                  <div className="icon-group">
                    <div className="icon instructors"><div className="icon-container"><img src={tempIcon} align="middle"></img><span>Instructors</span></div></div>
                    <div className="icon contact"><div className="icon-container"><img src={tempIcon} align="middle"></img><span>Contact</span></div></div>
                    <div className="icon grades"><div className="icon-container"><img src={tempIcon} align="middle"></img><span>Grades</span></div></div>
                    <div className="icon content"><div className="icon-container"><img src={tempIcon} align="middle"></img><span>Content</span></div></div>
                    <div className="icon forums"><div className="icon-container"><img src={tempIcon} align="middle"></img><span>Forums</span></div></div>
                    <div className="icon classroom"><div className="icon-container"><img src={tempIcon} align="middle"></img><span>Classroom</span></div></div>
                  </div>
                  <div className="outline-title">
                    Course Outline
                  </div>
                  <div className="outline">
                      {classInfo.outline}
                  </div>
                  
                </div>

                <div className="announcements">
                  
                <div className="announcements-title">
                  <div className="sort-button">
                    <span className="sort-header">Sort By</span>
                  </div>
                  <div className="announce-header">Announcements</div>
                  </div>
                </div>
              </div>

                <div className="to-do-bar">
                  <div className="calendar">
                  <div className="to-do-title">
                       <b>Calender</b>
                    </div>
                  </div>
                  <div className="to-do-list">
                    <div className="to-do-title">
                       <b>To-Do List</b>
                    </div>
                  </div>
                </div>
            </div>
    </div>
  );
}

export default Class;