/* eslint-disable */

import {React, useState, useEffect} from "react";
import PropTypes from "prop-types";
import Navigation from "./Navigation";
import EventCalendar from "./Calendar";
import ClassNav from "./ClassNav";
import Announcement from "./Announcement";
import ContentModule from "./ContentModule";
import "../styles/modules.css";
// import Client from "./beaverjs";

import SettingsIcon from "@material-ui/icons/Settings";

const unparsed = [
  {
    type: "text",
    data: `<p >ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddasdq<i> wdasjldj</i>as<u><b>d asd</b></u><u>awss</u>d qwo daw<s>opd jaw</s>spod lkas</p><h1 >s<i>a</i><a href="jknflkaldfdsd"><i>dla</i><i><b>s</b></i><b>kd</b></a><b>j qw</b>a <u>da</u>s <i>dq</i><s><i><b>w</b></i></s><s> ea </s>eas<s>e</s><s><u>a</u></s><u>s</u></h1><h5 ><u>rka woe</u><u><i> q</i></u><s><u><i><b>woej</b></i></u></s><s><u><b>a</b></u></s><u>wo</u>ed qwjo<b>q ejaj</b><u><b>d alw</b></u><u>sd asw</u></h5>`
  },
  {
    type: "image",
    data: "https://static.zerochan.net/Nishikino.Maki.full.2735664.jpg"
  },
  {
    type: "youtube",
    data: "https://www.youtube.com/embed/OURLqqtlaLo"
  }
];

const ContentPage = ({className = "Linear Algebra"}) => {

  const [protoMods, setProtoMods] = useState([]);

  let idx = 0;

  useEffect(() => {
    // TODO: Fetch modules from server
    setProtoMods(unparsed);
  }, []);

  useEffect(() => {
    for (const vid of document.getElementsByClassName("content-youtube")) {
      vid.style.height = `${parseInt(vid.offsetWidth * 9 / 16)}px`;
    }
  }, [protoMods]);  

  return (
    <div className="course-page">
      <div className="big-box">
        <div className="header">
          {className}
        </div>
        <div className="header">
        </div>
        <Navigation />
        <div className="middle-section" style={{width: "calc(100% - 112px)"}}>
          <ClassNav />
          <div className="content-modules">
            {protoMods.map((m) => {
              const cbs = [
                (key) => swap(key, key - 1),
                (key) => swap(key, key + 1),
                () => {},
                () => {}
              ];
              return <ContentModule module={m} idx={idx++} all={protoMods} setter={setProtoMods} />
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

ContentPage.propTypes = {
  // match: PropTypes.object.isRequired
};

export default ContentPage;
