import React from "react";
import PropTypes from "prop-types";
import EventLabel from "./EventLabel";
import DateLabel from "./DateLabel";
import ClassLabel from "./ClassLabel";
import {useHistory} from "react-router-dom";
import {useRef, useEffect, useState} from "react";
import Navigation from "./Navigation";
import Client from "./beaverjs";
import "../styles/upcoming.css";

const Upcoming = () => {
  const h = useHistory();
  const ref = useRef(null);
  const [events, setEvents] = useState([]);
  const [eventStore, setStore] = useState([]);
  const [classes, setClasses] = useState([]);

  const loadEvents = async () => {
    const client = new Client();
    const events = await client.getEvents();
    if (events.error) {
      h.push("/login");
    } else {
      const curEvents = events.filter(e => e.end >= Date.now());
      await setEvents(curEvents);
      setStore(curEvents);
    }
    const classes = await client.getCourses();
    if (classes.error) {
      h.push("/login");
    } else {
      await setClasses(classes);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (h.location.state && h.location.state.title && ref.current) ref.current.scrollIntoView({behavior: "smooth"});
    h.replace("/upcoming");
  }, [ref]);

  //TODO: optimize getting course details from id?

  return (
    <div className="upcoming-page">
      <Navigation />
      <div className="content-wrapper">
        <h1>Upcoming Events</h1>
        <div className="sort-button">Filter by class
          <div className="sort-options">
            <div key={"none"} className="sort-option" onClick={() => setEvents(eventStore)}>
              <span>{"None"}</span>
            </div>
            {classes.map(c => (
              <div key={c.name} className="sort-option" onClick={() => setEvents(eventStore.filter(event => event.class === c.id))}>
                <span>{c.name}</span>
              </div>)
            )}
          </div>
        </div>
        <div className="events">
          {events.length != 0 ? (events.map(event =>
            (h.location.state && event.title === h.location.state.title) ?
              <div className="event-wrapper">
                <DateLabel event={event} />
                <ClassLabel course={classes.filter(c => c.id === event.class)[0]} />
                <EventLabel formatString={"LLL d @ p"} ref={ref} event={event} selectedEvent={() => { }} />
              </div> :
              <div className="event-wrapper">
                <DateLabel event={event} />
                <ClassLabel course={classes.filter(c => c.id === event.class)[0]} />
                <EventLabel formatString={"LLL d @ p"} event={event} selectedEvent={() => { }} />
              </div>)) 
            : 
            (<div className="no-events">No events.</div>)
          }
        </div>
      </div>
    </div>
  );
};

Upcoming.propTypes = {
  title: PropTypes.string
};

export default Upcoming;