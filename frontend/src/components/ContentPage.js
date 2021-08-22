/* eslint-disable */

import {React, useState, useEffect} from "react";
import PropTypes from "prop-types";
import {useHistory} from "react-router-dom";
import Navigation from "./Navigation";
import EventCalendar from "./Calendar";
import ClassNav from "./ClassNav";
import Announcement from "./Announcement";
import ContentModule from "./ContentModule";
import "../styles/modules.css";
import Client from "./beaverjs";

const ContentPage = ({match}) => {

  const [protoMods, setProtoMods] = useState([]);
  const [changed, setChanged] = useState(false);
  const [previous, setPrevious] = useState([]);
  const [classInfo, setClassInfo] = useState({});

  const classID = match.params.classID;
  const contentID = match.params.contentID;
  const h = useHistory();

  const setter = (val) => {
    if (!changed) setPrevious(protoMods.slice(0));
    setProtoMods(val);
    setChanged(true);
  };

  const inserter = (idx) => {
    // TODO: Lazy, don't use alert.
    if (changed) return alert("Save or discard your changes first!");
    h.push(`/content/${classID}/${contentID}/add?insertAfter=${idx}`);
  };

  const updateSettings = (val, idx) => {
    // Since settings is a nested property, we need a deep clone. Apparently states are mutable within the same scope.
    const mods = JSON.parse(JSON.stringify(protoMods));
    mods[idx].settings = val;
    if (!changed) setPrevious(protoMods.slice(0));
    setProtoMods(mods);
    setChanged(true);
  };

  let idx = 0;

  useEffect(() => {
    const client = new Client();
    client.getClass(classID).then(setClassInfo);
    // TODO: Implement getContentModules method
    client.getContentModules(classID, contentID).then((res) => {
      setProtoMods(res);
      setPrevious(res);
    })
  }, []);

  useEffect(() => {
    for (const vid of document.getElementsByClassName("content-youtube")) {
      console.log(parseInt(vid.offsetWidth * 9 / 16));
      // vid.style.height = `${parseInt(vid.offsetWidth * 9 / 16)}px`;
    }
  }, [protoMods]);

  return (
    <div className="course-page">
      <div className="big-box">
        <div className="header">
          {classInfo.name}
        </div>
        <div className="header">
        </div>
        <Navigation />
        <div className="middle-section" style={{width: "calc(100% - 112px)"}}>
          <ClassNav />
          <div className="content-modules">
            {protoMods.map((m) => {
              return <ContentModule module={m} idx={idx++} all={protoMods} setter={setter} inserter={inserter} updateSettings={updateSettings} />
            })}
          </div>
        </div>
        <div className="changes-popup save-changes" style={{display: changed ? "block" : "none"}} onClick={() => {
          // TODO: Make API call to save changes in db
        }}>
          Save Changes
        </div>
        <div className="changes-popup discard-changes" style={{display: changed ? "block" : "none"}} onClick={() => {
          setProtoMods(previous.slice(0));
          setChanged(false);
        }}>
          Discard Changes
        </div>
      </div>
    </div>
  );
};

ContentPage.propTypes = {
  // match: PropTypes.object.isRequired
};

export default ContentPage;
