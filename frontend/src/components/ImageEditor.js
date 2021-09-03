/* eslint-disable */

import {React, useEffect, useState} from "react";
import "../styles/image_editor.css";
import PropTypes from "prop-types";

const EXT_TYPES = {
  "jpg": "Joint Photographic Experts Group",
  "jpeg": "Joint Photographic Experts Group",
  "png": "Portable Network Graphics"
};

const ImageEditor = ({cb, data = "", idx}) => {
  
  const [source, setSource] = useState(data);
  const [imageName, setImageName] = useState("");
  const [imageSize, setImageSize] = useState([-1]);
  const [imageType, setImageType] = useState("");

  useEffect(() => {
    console.log(imageSize);
    const img = document.getElementsByClassName("image-preview")[0];
    if (img.naturalWidth === 0) {
      setImageName("");
      setImageSize([-1]);
      setImageType("");
      return;
    }
    setImageName(decodeURI(source.slice(source.lastIndexOf("/") + 1)));
    setImageSize([img.naturalWidth, img.naturalHeight]);
    setImageType(EXT_TYPES[source.slice(source.lastIndexOf(".") + 1).toLowerCase()]);
  }, [source]);

  return (
    <div className="image-editor">
      <div className="not-preview">
        <div className="header"><span>Image Source:</span></div>
        <input className="source" type="text" value={source} onChange={(e) => {
          setSource(e.target.value);
          cb(e.target.value, idx);
        }} />
        <div className="image-data">
          <span className="data-header">Name:</span><span className="data-info">{imageName}</span><br />
          <span className="data-header">Size:</span><span className="data-info">{imageSize[0] === -1 ? "" : `${imageSize[0]}x${imageSize[1]}`}</span><br />
          <span className="data-header">Type:</span><span className="data-info">{imageType}</span>
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