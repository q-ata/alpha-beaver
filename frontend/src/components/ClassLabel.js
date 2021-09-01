import React from "react";
import PropTypes from "prop-types";

const ClassLabel = ({course}) => {
  return (
    <div className="class-container">
      {(course ? course.name : "")}
    </div>
  );
};

ClassLabel.propTypes = {
  course: PropTypes.object
};

export default ClassLabel;