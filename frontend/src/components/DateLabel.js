import React from "react";
import PropTypes from "prop-types";
import {format} from "date-fns";

const DateLabel = ({event}) => {
  const month = format(event.start, "LLL").toUpperCase();
  const day = format(event.start, "d");
  return (
    <div className="date-container">
      <div className="date-day">{day}</div>
      <div className="date-month">{month}</div>
      
    </div>
  );
};

DateLabel.propTypes = {
  event: PropTypes.object
};

export default DateLabel;