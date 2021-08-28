import React from "react";
import PropTypes from "prop-types";
import EventLabel from "./EventLabel";
import DateLabel from "./DateLabel";
import {useHistory} from "react-router-dom";
import {useRef, useEffect} from "react";
import Navigation from "./Navigation";
import "../styles/upcoming.css";

const events = [
  {
    "title": "All Day Event very long title",
    "id": 1,
    "allDay": true,
    "start": new Date(2021, 4, 1),
    "end": new Date(2021, 4, 1)
  },
  {
    "title": "Long Event",
    "id": 2,
    "start": new Date(2021, 4, 7),
    "end": new Date(2021, 4, 10, 0, 0, 1)
  },

  {
    "title": "DTS STARTS",
    "id": 3,
    "start": new Date(2021, 5, 15, 0, 0, 0),
    "end": new Date(2021, 5, 20, 0, 0, 1)
  },

  {
    "title": "DTS ENDS",
    "id": 4,
    "start": new Date(2021, 5, 6, 0, 0, 0),
    "end": new Date(2021, 5, 15, 0, 0, 1)
  },

  {
    "title": "Some Event",
    "id": 5,
    "start": new Date(2021, 5, 9, 0, 0, 0),
    "end": new Date(2021, 5, 9, 0, 0, 1)
  },
  {
    "title": "Conference",
    "id": 6,
    "start": new Date(2021, 5, 11),
    "end": new Date(2021, 5, 15),
    desc: "Big conference for important people"
  },
  {
    "title": "Meeting",
    "id": 7,
    "start": new Date(2021, 5, 12, 10, 50, 0, 0),
    "end": new Date(2021, 5, 12, 12, 50, 0, 0),
    desc: "Pre-meeting meeting, to prepare for the meeting"
  },
  {
    "title": "Lunch",
    "id": 8,
    "start": new Date(2021, 5, 12, 12, 0, 0, 0),
    "end": new Date(2021, 5, 12, 15, 0, 0, 0),
    desc: "Power lunch"
  },
  {
    "title": "Meeting",
    "id": 9,
    "start": new Date(2021, 5, 12, 14, 0, 0, 0),
    "end": new Date(2021, 5, 12, 15, 0, 0, 0)
  },
  {
    "title": "Happy Hour",
    "id": 10,
    "start": new Date(2021, 5, 12, 17, 0, 0, 0),
    "end": new Date(2021, 5, 12, 17, 50, 0, 0),
    desc: "Most important meal of the day"
  },
  {
    "title": "Dinner",
    "id": 11,
    "start": new Date(2021, 5, 12, 20, 0, 0, 0),
    "end": new Date(2021, 5, 12, 21, 0, 0, 0)
  },
  {
    "title": "Birthday Party",
    "id": 12,
    "start": new Date(2021, 5, 15, 7, 0, 0),
    "end": new Date(2021, 5, 15, 10, 50, 0)
  },
  {
    "title": "Birthday Party 2",
    "id": 13,
    "start": new Date(2021, 5, 15, 7, 0, 0),
    "end": new Date(2021, 5, 15, 10, 50, 0)
  },
  {
    "title": "Birthday Party 5",
    "id": 14,
    "start": new Date(2021, 5, 15, 7, 0, 0),
    "end": new Date(2021, 5, 15, 10, 50, 0)
  },
  {
    "title": "Late Night Event",
    "id": 15,
    "start": new Date(2021, 5, 17, 19, 50, 0),
    "end": new Date(2021, 5, 18, 2, 0, 0)
  },
  {
    "title": "Multi-day Event",
    "id": 16,
    "start": new Date(2021, 5, 20, 19, 50, 0),
    "end": new Date(2021, 5, 22, 2, 0, 0)
  }
];

const Upcoming = () => {
  const h = useHistory();
  const ref = useRef(null);

  useEffect(() => {
    if (h.location.state && h.location.state.title) ref.current.scrollIntoView({behavior: "smooth"});
    h.replace("/upcoming");
  }, [ref]);

  //TODO: Redirect if not logged in

  return (
    <div className="upcoming-page">
      <Navigation />
      <div className="content-wrapper">
        <h1>Upcoming Events</h1>
        {events.map(event =>
          (h.location.state && event.title === h.location.state.title) ?
            <div className="event-wrapper" key={event.id}>
              <DateLabel event={event} />
              <EventLabel formatString={"LLL d @ p"} ref={ref} event={event} selectedEvent={() => { }} />
            </div> :
            <div className="event-wrapper" key={event.id}>
              <DateLabel event={event} />
              <EventLabel formatString={"LLL d @ p"} event={event} selectedEvent={() => { }} />
            </div>)
        }
      </div>
    </div>
  );
};

Upcoming.propTypes = {
  title: PropTypes.string
};

export default Upcoming;