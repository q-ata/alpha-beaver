/* eslint-disable */
import React from 'react';
import {useEffect, useState} from "react";
import Navigation from "./Navigation";
import EventCalendar from "./Calendar";
import ClassNav from "./ClassNav";
import "../styles/class.css";

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
      
          <div className="big-box">
            <div className="header">
               {classInfo.title} [{classInfo.courseCode}]
            </div>
            <Navigation />
            <div className="middle-section">
              <ClassNav />
              <div className="outline-box">
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
                    <div className="sort-options">
                      <div className="sort-option"><span>Newest</span></div>
                      <div className="sort-option"><span>Oldest</span></div>
                    </div>
                  </div>
                  <div className="announce-header">Announcements</div>
                  </div>
                </div>
              </div>
                <div className="to-do-wrapper">
                  <div className="to-do-bar">
                    <div className="to-do-title">
                      Calender
                    </div>
                      <EventCalendar height="350px" fontSize="10px" />
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
}

export default Class;