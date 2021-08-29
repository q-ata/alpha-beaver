import {React, useState, useEffect} from "react";
import PropTypes from "prop-types";
import {Link, useHistory} from "react-router-dom";
import Client from "./beaverjs";
import Navigation from "./Navigation";
import ClassNav from "./ClassNav";
import "../styles/modules.css";

const AnnouncementCreate = ({match}) => {
  const h = useHistory();
  const classID = match.params.classID;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [classInfo, setClassInfo] = useState({});

  useEffect(() => {
    document.title = "Create Announcement";
    const client = new Client();
    client.getClass(classID).then((info) => {
      if (info.error) {
        h.push("/login");
      } else {
        setClassInfo(info);
      }
    });
  });

  const submitAnnouncement = (e) => {
    e.preventDefault();
    if (!title) {
      setErrorMessage("No title provided.");
      setShowError(true);
      return;
    }
    if (!content) {
      setErrorMessage("No content provided.");
      setShowError(true);
      return;
    }
    setShowError(false);
    const query = async () => {
      const date = Date.now();
      const client = new Client();
      const ann = {
        title,
        content,
        date
      };
      const data = await client.addAnnouncement(classID, ann);
      if (data.error) {
        setErrorMessage(data.msg);
        setShowError(true);
        return;
      }
      h.push("/class/" + classID);
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
          Create an announcement.
          <div className="announcement-creation form-page content">
            <div className="form-section">
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-field" value={title} onChange={(e) => setTitle(e.target.value)} /> <br />
              <label htmlFor="content" className="form-label">Content</label>
              <input type="text" className="form-field" value={content} onChange={(e) => setContent(e.target.value)} />
              <span className="error-message" style={{display: showError ? "block" : "none"}}>{errorMessage}</span>
              <Link className="submit-form" to="#" onClick={submitAnnouncement}>Create</Link>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

AnnouncementCreate.propTypes = {
  match: PropTypes.object.isRequired
};

export default AnnouncementCreate;