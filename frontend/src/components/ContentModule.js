/* eslint-disable */

import {React, useEffect, useState} from "react";
import ContentModuleSettings from "./ContentModuleSettings";

const imageSettings = [
  {
    title: "Source",
    type: "text",
    allow: "."
  },
  {
    title: "Size",
    type: "number",
    min: 0,
    max: 200,
    unit: "%",
    default: 80
  }
];

const youtubeSettings = [
  {
    title: "Source",
    type: "text",
    allow: "."
  }
]

const textSettings = [
  {
    title: "Selectable",
    type: "toggle"
  }
];

// TODO: Separate updateSettings callback from state setting callback to allow for live updates.
const ContentModule = ({module, all, setter, idx, inserter, updateSettings}) => {
  const RichTextEmbed = ({settings}) => {
    const [selectable, setSelectable] = useState(!!settings.selectable);
    textSettings[0].default = selectable;
    const updater = (val) => {
      setSelectable(val);
      updateSettings({selectable: val}, idx);
    }
    return (
      <div className="module-container">
        <ContentModuleSettings settings={textSettings} updateSettings={[updater]} modules={all} setter={setter} idx={idx} inserter={inserter} />
        <div className="content-text" style={{userSelect: selectable ? "text" : "none"}} dangerouslySetInnerHTML={{__html: settings.data}}></div>
      </div>
    );
  };
  
  const ImageEmbed = ({settings}) => {
    const [source, setSource] = useState(settings.source);
    const [size, setSize] = useState(settings.size || 80);
    const iSettings = imageSettings.slice(0);
    iSettings[0].default = source;
    const updater1 = (val) => {
      setSource(val);
      updateSettings({source: val, size}, idx);
    };
    const updater2 = (val) => {
      setSize(val);
      updateSettings({source, size: val}, idx);
    };
    return (
      <div className="module-container">
        <ContentModuleSettings settings={iSettings} updateSettings={[updater1, updater2]} modules={all} setter={setter} idx={idx} inserter={inserter} />
        <img className="content-image" src={source} width={`${size}%`} />
      </div>
    );
  };
  
  const YoutubeEmbed = ({settings}) => {
    const [source, setSource] = useState(settings.source);
    const ySettings = youtubeSettings.slice(0);
    ySettings[0].default = source;
    const updater = (val) => {
      setSource(val);
      updateSettings({source: val}, idx);
    }
    return (
      <div className="module-container">
        <ContentModuleSettings settings={youtubeSettings} updateSettings={[updater]} modules={all} setter={setter} idx={idx} inserter={inserter} />
        <iframe
          className="content-youtube"
          src={source}
          title="YouTube video player"
          frameBorder="0"
          allow="" // "accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
        ></iframe>
      </div>
    );
  };

  const parseModule = (m) => {
    let child;
    switch (m.type) {
    case "text":
      child = <RichTextEmbed settings={m.settings} modules={all} />
      break;
    case "image":
      child = <ImageEmbed settings={m.settings} modules={all} />
      break;
    case "youtube":
      child = <YoutubeEmbed settings={m.settings} modules={all} />
      break;
    }
    return child;
  };

  const parsedModule = parseModule(module);
  return parsedModule;
};

export default ContentModule;