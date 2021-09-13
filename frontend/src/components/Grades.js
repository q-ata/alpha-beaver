import {React, useState, useEffect} from "react";
import PropTypes from "prop-types";
import Navigation from "./Navigation";
import ClassNav from "./ClassNav";
import Client from "./beaverjs";
import "../styles/grades.css";

const Grade = ({assignment, score, feedback}) => {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="grade-item" onClick={() => setShowFeedback(!showFeedback)} title="Click to show feedback" >
      <div className="grade-main-item">
        <span className="grade-assign">
          {assignment}
        </span>
        <span className="grade-score">
          {score} %
        </span>
      </div>
      <div className="grade-feedback" style={{display: showFeedback ? "block" : "none"}}>
        <span>
          {feedback}
        </span>
      </div>
    </div>
  );
};
Grade.propTypes = {
  assignment: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  feedback: PropTypes.string.isRequired
};

const Grades = ({match}) => {

  const [client, setClient] = useState(undefined);
  const [className, setClassName] = useState("");
  const [gradeRes, setGradeRes] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const client = new Client();
    setClient(client);
    client.getClass(classID).then((res) => setClassName(res.name));
    client.getGrades(classID).then(setGradeRes);
  }, []);

  useEffect(() => {
    if (!gradeRes.length) return;
    client.getAssignments(classID).then((res) => {
      const m = new Map();
      for (const r of res) m.set(r.id, r);
      setGrades(gradeRes.map((g) => {
        const o = g;
        g.assignment = m.get(o.assignment);
        return o;
      }));
    });
  }, [gradeRes]);

  useEffect(() => {
    console.log(grades);
  }, [grades]);

  const classID = match.params.classID;

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
          <div className="grades">
            {grades.map((g, i) => {
              return <Grade key={i} assignment={g.assignment.title} score={g.score} feedback={g.feedback} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

Grades.propTypes = {
  match: PropTypes.object.isRequired
};

export default Grades;
