import React from "react";
import PropTypes from "prop-types";
import {useRef, useEffect} from "react";
import EventLabel from "./EventLabel";

const areEqual = () => true;

const Popup = React.memo(({calcDatePosition, classes, events, toggle, position, date, selectedEvent}) => {
  const ref = useRef(null);
  const boundRect = calcDatePosition(date, position);
  const calElems = document.getElementsByClassName("calendar");
  const divRect = calElems[calElems.length - 1].getBoundingClientRect();
  const style = {
    top: `${boundRect.top - divRect.top}px`,
    left: `${boundRect.left - divRect.left - 150}px`
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        toggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, ["ref"]);

  let listItems = events.map(event =>
    <EventLabel key={event.id} course={classes.filter(c=>c.id === event.class)[0]} event={event} selectedEvent={selectedEvent} />
  );

  if (listItems.length === 0) listItems = <EventLabel key={0} event={{title: "No events."}} selectedEvent={selectedEvent} />;

  return (
    <div ref={ref} style={style} className="modal">
      {listItems}
      <div className="modal-button" onClick={toggle}>&times;</div>
    </div>
  );
}, areEqual);

Popup.displayName = "Popup";

Popup.propTypes = {
  toggle: PropTypes.func,
  events: PropTypes.array,
  position: PropTypes.object,
  date: PropTypes.object,
  calcDatePosition: PropTypes.func,
  selectedEvent: PropTypes.func,
  classes: PropTypes.array
};

export default Popup;