import React from "react";
import {Calendar, dateFnsLocalizer} from "react-big-calendar";
import PropTypes from "prop-types";
import {format, parse, startOfWeek, getDay} from "date-fns";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Popup from "./Popup";
import {useEffect, useState} from "react";
import "../styles/calendar.css";
import locale from "date-fns/locale/en-US";

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
    "end": new Date(2021, 5, 20, 0, 0, 0)
  },

  {
    "title": "DTS ENDS",
    "id": 4,
    "start": new Date(2021, 5, 6, 0, 0, 0),
    "end": new Date(2021, 5, 15, 0, 0, 0)
  },

  {
    "title": "Some Event",
    "id": 5,
    "start": new Date(2021, 5, 9, 0, 0, 0),
    "end": new Date(2021, 5, 9, 0, 0, 0)
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

const EventCalendar = ({width = "100%", height = "250px", fontSize = "8px"}) => {
  const [isOpen, changeOpen] = useState(false);
  const [curDate, changeDate] = useState(new Date());
  const [position, setPosition] = useState({x: 0, y: 0});

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

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
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
        selectable={true}
        formats={formats}
      />
      {
        isOpen ?
          <Popup
            events={
              events.filter((event) =>
                moment(curDate).isBetween(moment(event.start), moment(event.end), "day", "[]")
              )
            }
            toggle={togglePopup}
            position={position}
            date={curDate}
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