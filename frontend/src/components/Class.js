import React from "react";
import PropTypes from "prop-types";
// import {useEffect, useState} from "react";
import Navigation from "./Navigation";
import EventCalendar from "./Calendar";
import ClassNav from "./ClassNav";
import "../styles/class.css";

const classInfo = {
  logo: "",
  courseCode: "MCD101",
  title: "Mcdonalds Employee Training",
  outline:
    "Welcome to Mcdonalds! Through this course you will learn how to flip burgers and make icecream.",
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
};

const Class = ({match}) => {
  const classID = match.params.classID;
  console.log(classID);

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
            <div className="outline-title">Course Outline</div>
            <div className="outline">{classInfo.outline}</div>
          </div>

          <div className="announcements">
            <div className="announcements-title">
              <div className="sort-button">
                <span className="sort-header">Sort By</span>
                <div className="sort-options">
                  <div className="sort-option">
                    <span>Newest</span>
                  </div>
                  <div className="sort-option">
                    <span>Oldest</span>
                  </div>
                </div>
              </div>
              <div className="announce-header">Announcements</div>
            </div>
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
