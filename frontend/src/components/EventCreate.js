import {React, useState, useEffect} from "react";
import PropTypes from "prop-types";
import {Link, useHistory} from "react-router-dom";
import Client from "./beaverjs";
import Navigation from "./Navigation";
import ClassNav from "./ClassNav";
import "../styles/modules.css";

const EventCreate = ({match}) => {
  const h = useHistory();
  const classID = match.params.classID;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [startTime, setStart] = useState(0);
  const [endTime, setEnd] = useState(0);
  const [classInfo, setClassInfo] = useState({});

  useEffect(() => {
    document.title = "Create Event";
    const client = new Client();
    client.getClass(classID).then((info) => {
      if (info.error) {
        h.push("/login");
      } else {
        setClassInfo(info);
      }
    });
    const date = new Date().toISOString().slice(0, -5);
    setStart(date);
    setEnd(date);
  }, []);

  const submitEvent = (e) => {
    e.preventDefault();
    if (!title) {
      setErrorMessage("No title provided.");
      setShowError(true);
      return;
    }
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    console.log(start);
    console.log(end);
    if(start > end) {
      setErrorMessage("Start date cannot be after end date.");
      setShowError(true);
      return;
    }
    setShowError(false);
    const query = async () => {
      const client = new Client();
      const event = {
        title,
        content,
        start,
        end
      };
      const data = await client.addEvent(classID, event);
      if (data.error) {
        setErrorMessage(data.msg);
        setShowError(true);
        return;
      }

      //replace later
      alert("Event successfully created.");
      h.push("/content/" + classID + "/events/add");
    };
    query();
  };

  return (
    <div className="course-page">
      <div className="big-box">
        <div className="header">
          {classInfo.name}
        </div>
        <div className="header">
        </div>
        <Navigation />
        <div className="middle-section" style={{width: "calc(100% - 112px)"}}>
          <ClassNav />
          Create an event.
          <div className="event-creation form-page content">
            <div className="form-section">
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-field" value={title} onChange={(e) => setTitle(e.target.value)} /> <br />
              <label htmlFor="content" className="form-label">Content</label>
              <input type="text" className="form-field" value={content} onChange={(e) => setContent(e.target.value)} /> <br />
              <label htmlFor="content" className="form-label">Start</label>
              <input type="datetime-local" className="form-field" value={startTime} onChange={(e) => setStart(e.target.value)} /> <br />
              <label htmlFor="content" className="form-label">End</label>
              <input type="datetime-local" className="form-field" value={endTime} onChange={(e) => setEnd(e.target.value)} />
              <span className="error-message" style={{display: showError ? "block" : "none"}}>{errorMessage}</span>
              <Link className="submit-form" to="#" onClick={submitEvent}>Create</Link>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

EventCreate.propTypes = {
  match: PropTypes.object.isRequired
};

export default EventCreate;