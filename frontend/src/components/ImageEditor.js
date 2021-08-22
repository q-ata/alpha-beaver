/* eslint-disable */

import {React, useState} from "react";
import "../styles/image_editor.css";
import PropTypes from "prop-types";

const ImageEditor = ({cb, data = "", idx}) => {
  
  const [source, setSource] = useState(data);

  return (
    <div className="image-editor">
      <div className="not-preview">
        <div className="header"><span>Image Source:</span></div>
        <input className="source" type="text" value={source} onChange={(e) => {
          setSource(e.target.value);
          cb(e.target.value, idx);
        }} />
        <div className="image-data">
          <span className="data-header">Name:</span><span className="data-info">lol dqwiuhasdqweqwtfaesdgsdfgsdfsdfdoaw wedasoie dhjawso dqwiwejihuasw.png</span><br />
          <span className="data-header">Size:</span><span className="data-info">10GB</span><br />
          <span className="data-header">Type:</span><span className="data-info">Portable Network Graphics</span>
        </div>
      </div>
      <div className="preview">
        <img className="image-preview" src={source} alt="Could not load image preview!" />
      </div>
    </div>
  );

};

ImageEditor.propTypes = {
};

export default ImageEditor;