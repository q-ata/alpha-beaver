/* eslint-disable */

import {React, useState, useEffect} from "react";
import PropTypes from "prop-types";
import Navigation from "./Navigation";
import EventCalendar from "./Calendar";
import ClassNav from "./ClassNav";
import Announcement from "./Announcement";
import "../styles/class.css";
import Client from "./beaverjs";
import ContentBlock from "./ContentBlock";

const ContentPage = () => {

  return (
    <div className="course-page">
      <div className="big-box">
        <div className="header">
        </div>
        <Navigation />
        <div className="middle-section">
          <ClassNav />
          <ContentBlock />
        </div>
      </div>
    </div>
  );
};

ContentPage.propTypes = {
  match: PropTypes.object.isRequired
};

export default ContentPage;
