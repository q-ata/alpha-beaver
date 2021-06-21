import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

const Course = ({name, desc, background, color, cid}) => {
  return (
    <Link to={`/class/${cid}`} style={{color: "black"}}>
      <div className="card">
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
    </Link>
  );

};

Course.propTypes = {
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  background: PropTypes.string,
  color: PropTypes.string,
  cid: PropTypes.number.isRequired
};

export default Course;