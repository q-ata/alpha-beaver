import React from "react";
import PropTypes from "prop-types";
import {format} from "date-fns";
import {forwardRef} from "react";

const EventLabel = forwardRef(({formatString, event, selectedEvent}, ref) => {

  const formatDate = (time, formatString) => {
    if(!formatString) return format(time, "LLL do");
    return format(time, formatString);
  };

  return (
    <div ref={ref} className="event-container" onClick={()=>selectedEvent(event)}>
      <div className="event-header">{event.title}</div>
      {event.start != null && (formatDate(event.start, formatString) !== formatDate(event.end, formatString) ?
        <span className="event-time">{formatDate(event.start, formatString)} to {formatDate(event.end, formatString)}</span>
        : <span className="event-time">{formatDate(event.start, "LLL d @ p")}</span>)}
    </div>
  );
});

EventLabel.propTypes = {
  formatString: PropTypes.string,
  event: PropTypes.object,
  selectedEvent: PropTypes.func
};

EventLabel.displayName = "EventLabel";

export default EventLabel;