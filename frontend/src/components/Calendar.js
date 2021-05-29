import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const events = [
  {
    "title": "All Day Event very long title",
    "allDay": true,
    "start": new Date(2021, 5, 0),
    "end": new Date(2021, 5, 1)
  },
  {
    "title": "Long Event",
    "start": new Date(2021, 5, 7),
    "end": new Date(2021, 5, 10)
  },

  {
    "title": "DTS STARTS",
    "start": new Date(2021, 5, 15, 0, 0, 0),
    "end": new Date(2021, 5, 20, 0, 0, 0)
  },

  {
    "title": "DTS ENDS",
    "start": new Date(2021, 5, 6, 0, 0, 0),
    "end": new Date(2021, 5, 15, 0, 0, 0)
  },

  {
    "title": "Some Event",
    "start": new Date(2021, 5, 9, 0, 0, 0),
    "end": new Date(2021, 5, 9, 0, 0, 0)
  },
  {
    "title": "Conference",
    "start": new Date(2021, 5, 11),
    "end": new Date(2021, 5, 15),
    desc: "Big conference for important people"
  },
  {
    "title": "Meeting",
    "start": new Date(2021, 5, 12, 10, 50, 0, 0),
    "end": new Date(2021, 5, 12, 12, 50, 0, 0),
    desc: "Pre-meeting meeting, to prepare for the meeting"
  },
  {
    "title": "Lunch",
    "start": new Date(2021, 5, 12, 12, 0, 0, 0),
    "end": new Date(2021, 5, 12, 15, 0, 0, 0),
    desc: "Power lunch"
  },
  {
    "title": "Meeting",
    "start": new Date(2021, 5, 12, 14, 0, 0, 0),
    "end": new Date(2021, 5, 12, 15, 0, 0, 0)
  },
  {
    "title": "Happy Hour",
    "start": new Date(2021, 5, 12, 17, 0, 0, 0),
    "end": new Date(2021, 5, 12, 17, 50, 0, 0),
    desc: "Most important meal of the day"
  },
  {
    "title": "Dinner",
    "start": new Date(2021, 5, 12, 20, 0, 0, 0),
    "end": new Date(2021, 5, 12, 21, 0, 0, 0)
  },
  {
    "title": "Birthday Party",
    "start": new Date(2021, 5, 15, 7, 0, 0),
    "end": new Date(2021, 5, 15, 10, 50, 0)
  },
  {
    "title": "Birthday Party 2",
    "start": new Date(2021, 5, 15, 7, 0, 0),
    "end": new Date(2021, 5, 15, 10, 50, 0)
  },
  {
    "title": "Birthday Party 5",
    "start": new Date(2021, 5, 15, 7, 0, 0),
    "end": new Date(2021, 5, 15, 10, 50, 0)
  },
  {
    "title": "Late Night Event",
    "start": new Date(2021, 5, 17, 19, 50, 0),
    "end": new Date(2021, 5, 18, 2, 0, 0)
  },
  {
    "title": "Multi-day Event",
    "start": new Date(2021, 5, 20, 19, 50, 0),
    "end": new Date(2021, 5, 22, 2, 0, 0)
  }
];

const eventStyleGetter = () => {
  const backgroundColor = "#000";
  const style = {
    backgroundColor: backgroundColor,
    padding: "1px",
    fontSize: "7px"
  };
  return {
    style: style
  };
};

const EventCalendar = () => {
  return (
    <Calendar
      localizer={localizer}
      events = {events}
      eventPropGetter = {eventStyleGetter}
      views={["month"]}
      startAccessor="start"
      endAccessor="end"
    />
  );
};

export default EventCalendar;