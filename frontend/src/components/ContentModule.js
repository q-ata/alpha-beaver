import {React, useEffect, useState} from "react";
import PropTypes from "prop-types";
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
  },
  {
    title: "Size",
    type: "number",
    min: 10,
    max: 100,
    unit: "%",
    default: 80
  }
];

const textSettings = [
  {
    title: "Selectable",
    type: "toggle",
    default: true
  }
];

// TODO: Separate updateSettings callback from state setting callback to allow for live updates.
const ContentModule = ({module, all, setter, idx, inserter, updateSettings}) => {
  const RichTextEmbed = ({settings}) => {
    const [selectable, setSelectable] = useState(settings.selectable);
    // Need a deep clone or else multiple modules of same type will overlap settings objects
    const tSettings = JSON.parse(JSON.stringify(textSettings));
    tSettings[0].default = selectable;
    const updater = (val) => {
      setSelectable(val);
      updateSettings({selectable: val, data: settings.data}, idx);
    };
    return (
      <div className="module-container">
        <ContentModuleSettings settings={tSettings} updateSettings={[updater]} modules={all} setter={setter} idx={idx} inserter={inserter} />
        <div className="content-text" style={{userSelect: selectable ? "text" : "none"}} dangerouslySetInnerHTML={{__html: settings.data}}></div>
      </div>
    );
  };
  RichTextEmbed.propTypes = {
    settings: PropTypes.shape({
      selectable: PropTypes.bool,
      data: PropTypes.string
    })
  };
  
  const ImageEmbed = ({settings}) => {
    const [source, setSource] = useState(settings.source);
    const [size, setSize] = useState(settings.size || 80);
    const iSettings = JSON.parse(JSON.stringify(imageSettings));
    iSettings[0].default = source;
    iSettings[1].default = size;
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
  ImageEmbed.propTypes = {
    settings: PropTypes.shape({
      source: PropTypes.string,
      size: PropTypes.number
    })
  };
  
  const YoutubeEmbed = ({settings}) => {
    const [source, setSource] = useState(settings.source);
    const [size, setSize] = useState(settings.size || 80);
    const [height, setHeight] = useState(100);
    const ySettings = JSON.parse(JSON.stringify(youtubeSettings));
    ySettings[0].default = source;
    ySettings[1].default = settings.size;
    const updater1 = (val) => {
      setSource(val);
      updateSettings({source: val, size}, idx);
    };
    const updater2 = (val) => {
      setSize(val);
      updateSettings({source, size: val}, idx);
    };
    useEffect(() => setHeight(parseInt(document.getElementById(`youtube-module-${idx}`).offsetWidth * 9 / 16)), [size]);
    return (
      <div className="module-container">
        <ContentModuleSettings settings={youtubeSettings} updateSettings={[updater1, updater2]} modules={all} setter={setter} idx={idx} inserter={inserter} />
        <iframe
          className="content-youtube"
          src={source}
          title="YouTube video player"
          frameBorder="0"
          allow="" // "accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
          id={`youtube-module-${idx}`}
          width={`${size}%`}
          height={`${height}px`}
        ></iframe>
      </div>
    );
  };
  YoutubeEmbed.propTypes = {
    settings: PropTypes.shape({
      source: PropTypes.string,
      size: PropTypes.number
    })
  };

  const parseModule = (m) => {
    let child;
    switch (m.type) {
    case 0:
      child = <RichTextEmbed settings={m.data} modules={all} />;
      break;
    case 1:
      child = <ImageEmbed settings={m.data} modules={all} />;
      break;
    case 2:
      child = <YoutubeEmbed settings={m.data} modules={all} />;
      break;
    }
    return child;
  };
  const parsedModule = parseModule(module);
  return parsedModule;
};

export default ContentModule;