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
import YouTubeEditor from "./YouTubeEditor";

const RICH_TEXT = 0;
const IMAGE = 1;
const YOUTUBE_VIDEO = 2;

const createDefaultModule = (type, content) => {
  switch (type) {
  case RICH_TEXT:
    return {data: content, selectable: true};
  case IMAGE:
    return {source: content, size: 80};
  case YOUTUBE_VIDEO:
    return {source: content, size: 80};
  }
}

const ModuleCreator = ({match}) => {

  const [className, setClassName] = useState("");
  const [selectedType, setSelectedType] = useState(RICH_TEXT);
  const [data, setData] = useState({});
  const [client, setClient] = useState(undefined);
  const dataCb = (val, idx) => {
    const cpy = Object.assign({}, data);
    cpy[idx] = val;
    setData(cpy);
  }

  const h = useHistory();

  const editorInterfaces = [
    <RichTextEditor cb={dataCb} data={data[RICH_TEXT]} idx={RICH_TEXT} />,
    <ImageEditor cb={dataCb} data={data[IMAGE]} idx={IMAGE} />,
    <YouTubeEditor cb={dataCb} data={data[YOUTUBE_VIDEO]} idx={YOUTUBE_VIDEO} />
  ]

  const classID = match.params.classID;
  const contentID = match.params.contentID;
  const insertAfter = new URLSearchParams(location.search).get("insertAfter");

  useEffect(() => {
    // This is valid
    const client = new Client();
    setClient(client);
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

          <div className="submit-module" onClick={async () => {
            const content = data[selectedType];
            if (!content) return;
            const {id} = await client.addModule(classID, {class: classID, type: selectedType, data: createDefaultModule(selectedType, content)});
            const page = await client.getPage(classID, contentID);
            const modules = page.modules;
            modules.splice(insertAfter, 0, id);
            client.setPageModules(classID, contentID, modules);
            h.push(`/content/${classID}/${contentID}/view`);
          }}>
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
