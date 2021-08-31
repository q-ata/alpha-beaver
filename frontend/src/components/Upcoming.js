import React from "react";
import PropTypes from "prop-types";
import EventLabel from "./EventLabel";
import DateLabel from "./DateLabel";
import {useHistory} from "react-router-dom";
import {useRef, useEffect, useState} from "react";
import Navigation from "./Navigation";
import Client from "./beaverjs";
import "../styles/upcoming.css";

const Upcoming = () => {
  const h = useHistory();
  const ref = useRef(null);
  const [events, setEvents] = useState([]);

  const loadEvents = async () => {
    const client = new Client();
    const events = await client.getEvents();
    if(events.error) {
      h.push("/login");
    } else {
      setEvents(events);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (h.location.state && h.location.state.title && ref.current) ref.current.scrollIntoView({behavior: "smooth"});
    h.replace("/upcoming");
  }, [ref]);

  return (
    <div className="upcoming-page">
      <Navigation />
      <div className="content-wrapper">
        <h1>Upcoming Events</h1>
        {events.map(event =>
          (h.location.state && event.title === h.location.state.title) ?
            <div className="event-wrapper">
              <DateLabel event={event} />
              <EventLabel formatString={"LLL d @ p"} ref={ref} event={event} selectedEvent={() => { }} />
            </div> :
            <div className="event-wrapper">
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