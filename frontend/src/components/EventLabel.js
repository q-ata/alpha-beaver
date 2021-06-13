import React from "react";
import PropTypes from "prop-types";
import {format} from "date-fns";

const EventLabel = ({event}) => {
  return (
    <div className="event-container">
      <div className="event-header">{event.title}</div>
      {event.start != null && (event.start.getTime() !== event.end.getTime() ?
        <span className="event-time">{format(event.start, "LLL do")} to {format(event.end, "LLL do")}</span>
        : <span className="event-time">{format(event.start, "LLL do")}</span>)}
    </div>
  );
};

EventLabel.propTypes = {
  event: PropTypes.object
};

export default EventLabel;