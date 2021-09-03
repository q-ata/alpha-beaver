/* eslint-disable */

import {React, useState, useEffect} from "react";
import PropTypes from "prop-types";
import Navigation from "./Navigation";
import EventCalendar from "./Calendar";
import ClassNav from "./ClassNav";
import Announcement from "./Announcement";
import Client from "./beaverjs";
import {useHistory} from "react-router-dom";
import Select from "react-select";

const Submit = ({match}) => {

  const [client, setClient] = useState(undefined);
  const [className, setClassName] = useState("");
  const [options, setOptions] = useState([]);

  const h = useHistory();
  const classID = match.params.classID;

  useEffect(() => {
    const client = new Client();
    setClient(client);
    client.getClass(classID).then((res) => setClassName(res.name));

    setOptions([{value: 1, label: "one"}, {value: 2, label: "two"}]);
  }, []);

  return (
    <div className="course-page">
      <div className="big-box">
        <div className="header">
          {className}
        </div>
        <div className="header">
        </div>
        <Navigation />
        <div className="middle-section" style={{width: "calc(100% - 112px)"}}>
          <ClassNav classID={classID} />
          <div className="submission">
            <div className="selector" style={{width: "200px"}}>
              <Select options={options} onChange={console.log} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Submit.propTypes = {
  match: PropTypes.object.isRequired
};

export default Submit;
