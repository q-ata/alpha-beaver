/* eslint-disable */

import {React, useState} from "react";
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
    type: "toggle",
    default: true
  }
];

const ContentModule = ({module, all, setter, idx}) => {
  const RichTextEmbed = ({content}) => {
    const [selectable, setSelectable] = useState(true);
    return (
      <div className="module-container">
        <ContentModuleSettings settings={textSettings} updateSettings={[setSelectable]} modules={all} setter={setter} idx={idx} />
        <div className="content-text" style={{userSelect: selectable ? "text" : "none"}} dangerouslySetInnerHTML={{__html: content}}></div>
      </div>
    );
  };
  
  const ImageEmbed = ({src, width = "", height = ""}) => {
    const [source, setSource] = useState(src);
    const [size, setSize] = useState(80);
    const iSettings = imageSettings.slice(0);
    iSettings[0].default = src;
    return (
      <div className="module-container">
        <ContentModuleSettings settings={iSettings} updateSettings={[setSource, setSize]} modules={all} setter={setter} idx={idx} />
        <img className="content-image" src={src} width={`${size}%`} height={height} />
      </div>
    );
  };
  
  const YoutubeEmbed = ({src}) => {
    const [source, setSource] = useState(src);
    const ySettings = youtubeSettings.slice(0);
    ySettings[0].default = src;
    return (
      <div className="module-container">
        <ContentModuleSettings settings={youtubeSettings} updateSettings={[setSource]} modules={all} setter={setter} idx={idx} />
        <iframe
          className="content-youtube"
          src={src}
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
      child = <RichTextEmbed content={m.data} modules={all} />
      break;
    case "image":
      child = <ImageEmbed src={m.data} modules={all} />
      break;
    case "youtube":
      child = <YoutubeEmbed src={m.data} modules={all} />
      break;
    }
    return child;
  };

  const parsedModule = parseModule(module);
  return parsedModule;
};

export default ContentModule;