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

import RichTextEditor from "./RichTextEditor";
import ImageEditor from "./ImageEditor";

const RICH_TEXT = 0;
const IMAGE = 1;
const YOUTUBE_VIDEO = 2;

const ModuleCreator = ({match}) => {

  const [className, setClassName] = useState("");
  const [selectedType, setSelectedType] = useState(RICH_TEXT);
  const [data, setData] = useState({});
  const dataCb = (val, idx) => {
    const cpy = Object.assign({}, data);
    cpy[idx] = val;
    setData(cpy);
  }

  const editorInterfaces = [
    <RichTextEditor cb={dataCb} data={data[RICH_TEXT]} idx={RICH_TEXT} />,
    <ImageEditor cb={dataCb} data={data[IMAGE]} idx={IMAGE} />
  ]

  const classID = match.params.classID;
  const contentID = match.params.contentID;

  useEffect(() => {
    const client = new Client();
    client.getClass(classID).then((res) => setClassName(res.name));
  }, []);

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
          
          <div className="type-selector">
            <div className="type-selector-header">
              Type of Module
            </div>
            <div className="type-selector-types">
              {/* TODO: Should probably make these a component instead of raw img */}
              <img className={`${selectedType === RICH_TEXT ? "type-selector-selected" : ""}`} src="https://qata.gay/files/rich_text.png" onClick={() => {
                setSelectedType(RICH_TEXT);
              }} />
              <img className={`${selectedType === IMAGE ? "type-selector-selected" : ""}`} src="https://qata.gay/files/image.png" onClick={() => {
                setSelectedType(IMAGE);
              }}/>
              <img className={`${selectedType === YOUTUBE_VIDEO ? "type-selector-selected" : ""}`} src="https://qata.gay/files/youtube_video.png" onClick={() => {
                setSelectedType(YOUTUBE_VIDEO)
              }}/>
            </div>
          </div>

          {editorInterfaces[selectedType]}

          <div className="submit-module">
            Submit
          </div>

        </div>
      </div>
    </div>
  );
};

ModuleCreator.propTypes = {
  // match: PropTypes.object.isRequired
};

export default ModuleCreator;
