import React from "react";
import PropTypes from "prop-types";

const Course = ({name, desc, background, color}) => {
  return (
    <div className="card" onClick={(e) => console.log(e)}>
      <div style={{backgroundImage: `url("${background}")`}} className="card-preview-image">
      </div>
      <div style={{backgroundColor: `#${color}`}} className="card-info">
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
  background: PropTypes.string,
  color: PropTypes.string
};

export default Course;