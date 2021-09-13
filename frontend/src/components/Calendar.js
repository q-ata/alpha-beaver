import React from "react";
import {Calendar, dateFnsLocalizer} from "react-big-calendar";
import PropTypes from "prop-types";
import {isWithinInterval, format, parse, startOfWeek, getDay} from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Popup from "./Popup";
import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import "../styles/calendar.css";
import locale from "date-fns/locale/en-US";
import Client from "./beaverjs";

const locales = {
  "en-US": locale
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const formats = {
  weekdayFormat: (date, culture, localizer) => localizer.format(date, "EEE", culture)
};

const EventCalendar = ({width = "100%", height = "250px", fontSize = "8px"}) => {
  const [isOpen, changeOpen] = useState(false);
  const [curDate, changeDate] = useState(new Date());
  const [position, setPosition] = useState({x: 0, y: 0});
  const [events, setEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const h = useHistory();

  const eventStyleGetter = () => {
    const backgroundColor = "#000";
    const style = {
      backgroundColor: backgroundColor,
      padding: "1px",
      fontSize
    };
    return {
      style: style
    };
  };

  const loadEvents = async () => {
    const client = new Client();
    const events = await client.getEvents();
    if(events.error) {
      h.push("/login");
    } else {
      setEvents(events);
    }
    const classes = await client.getCourses();
    if(classes.error) {
      h.push("/login");
    } else {
      setClasses(classes);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    loadEvents();
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const onMouseMove = (e) => {
    setPosition({
      x: e.screenX,
      y: e.screenY
    });
    setTimeout(() => { }, 100);
  };

  const togglePopup = (date) => {
    changeOpen(!isOpen);
    if (date != undefined) changeDate(date);
  };

  const selectedEvent = (event) => {
    h.push("/upcoming", {title: event.title});
  };

  const calcDatePosition = (date, position) => {
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const c = document.getElementsByClassName("rbc-date-cell");
    let mindis = 100000;
    let p;
    for(let i = 0; i < c.length; i++) {
      const dayString = format(date, "dd");
      if(c[i].textContent === dayString) {
        const targetDate = c[i].getElementsByTagName("A");
        const boundRect = targetDate[0].getBoundingClientRect();
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

  return (
    <div className="calendar" onMouseMove={onmousemove} style={{width, height}}>
      <Calendar
        localizer={localizer}
        events={events}
        onDrillDown={togglePopup}
        eventPropGetter={eventStyleGetter}
        views={["month"]}
        startAccessor="start"
        endAccessor="end"
        selectable={false}
        formats={formats}
        onSelectEvent={selectedEvent}
      />
      {
        isOpen ?
          <Popup
            events={
              events.filter((event) =>
                isWithinInterval(curDate, {
                  start: new Date(
                    event.start.getFullYear(),
                    event.start.getMonth(),
                    event.start.getDate(),
                    0,
                    0,
                    0,
                    0
                  ),
                  end: new Date(
                    event.end.getFullYear(),
                    event.end.getMonth(),
                    event.end.getDate(),
                    0,
                    0,
                    0,
                    0
                  )
                })
              )
            }
            classes={classes} 
            toggle={togglePopup}
            position={position}
            date={curDate}
            calcDatePosition={calcDatePosition} 
            selectedEvent={selectedEvent}
          />
          : null
      }
    </div>
  );
};

EventCalendar.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fontSize: PropTypes.string
};

export default EventCalendar;