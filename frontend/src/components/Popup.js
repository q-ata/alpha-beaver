import React from "react";
import PropTypes from "prop-types";
import {useRef, useEffect} from "react";
import EventLabel from "./EventLabel";
import {format} from "date-fns";

const areEqual = () => true;

const calcDatePosition = (date, position) => {
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  const c = document.getElementsByClassName("rbc-date-cell");
  let mindis = 100000;
  let p;
  for(let i = 0; i < c.length; i++) {
    const dayString = format(date, "dd");
    if(c[i].textContent === dayString) {
      const boundRect = c[i].getBoundingClientRect();
      const ydiff = position.y - boundRect.top - window.screen.availHeight + vh;
      const xdiff = position.x - boundRect.left;
      const dis = Math.sqrt(Math.pow(ydiff, 2) + Math.pow(xdiff, 2));
      if(dis < mindis) {
        mindis = dis;
        p = boundRect;
      }
    }
  }
  return p;
};

const Popup = React.memo(({events, toggle, position, date}) => {
  const ref = useRef(null);

  const boundRect = calcDatePosition(date, position);

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const style = {
    top: boundRect.top,
    left: boundRect.left - vw + 360 - 105
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
    <EventLabel key={event.id} event={event} />
  );

  if (listItems.length === 0) listItems = <EventLabel key={0} event={{title: "No events."}} />;

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
  date: PropTypes.object
};

export default Popup;