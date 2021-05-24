import React from "react";
import PropTypes from "prop-types";

const Course = ({name, desc, img}) => {
  return (
    <div className="card">
      <div style={{backgroundImage: img}} className="card-preview-image">
      </div>
      <div className="card-info">
        <div className="card-class-title">
          <span>{name}</span>
        </div>
        <div className="card-desc">
          <span>{desc}</span>
        </div>
      </div>
    </div>
  );

};

Course.propTypes = {
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  img: PropTypes.string
};

export default Course;