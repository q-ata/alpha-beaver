import {React, useState, useEffect} from "react";
import PropTypes from "prop-types";
import Navigation from "./Navigation";
import ClassNav from "./ClassNav";
import Client from "./beaverjs";
// import {useHistory} from "react-router-dom";
import Select from "react-select";
import AddIcon from "@material-ui/icons/Add";
import ImageIcon from "@material-ui/icons/Image";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import "../styles/submit.css";

const FILE_TYPES = {
  EMPTY: 0,
  IMAGE: 1,
  PDF: 2
};

const SubmittedPage = ({idx, dName, dType, updater, deleter}) => {

  const PLACEHOLDERS = [
    <AddIcon key={0} />,
    <ImageIcon key={1} />,
    <PictureAsPdfIcon key={2} />
  ];

  const [file, setFile] = useState(undefined);
  const [fileName, setFileName] = useState(dName);
  const [fileType, setFileType] = useState(dType);
  const [showDelete, setShowDelete] = useState(dType !== FILE_TYPES.EMPTY);
  const deleteIcon = <DeleteForeverIcon />;

  const changeFile = (newFile) => {
    const type = newFile.name.endsWith(".pdf") ? FILE_TYPES.PDF : FILE_TYPES.IMAGE;
    setFileName(newFile.name);
    setFileType(type);
    setFile(newFile);
    setShowDelete(true);
  };

  useEffect(() => {
    if (fileType === FILE_TYPES.EMPTY && file === false) deleter(idx);
    else if (file) updater(idx, {idx, dFile: file, dName: file.name, dType: fileType});
  }, [fileType]);

  return (
    <div className="submitted-item" title={fileName}
      onMouseEnter={() => {
        if (fileType !== FILE_TYPES.EMPTY) setShowDelete(true);
      }}
      onMouseLeave={() => {
        setShowDelete(false);
      }}>
      <div className="deleter" style={{display: showDelete ? "" : "none"}}
        onClick={() => {
          setFileType(FILE_TYPES.EMPTY);
          setShowDelete(false);
          setFileName("");
          setFile(false);
        }}>
        {deleteIcon}
      </div>
      <label htmlFor={`file-input${idx}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          changeFile(e.dataTransfer.items[0].getAsFile());
        }}>
        {PLACEHOLDERS[fileType]}
      </label>
      <input id={`file-input${idx}`} type="file" style={{display: "none"}}
        accept="image/png, image/jpeg, .pdf"
        onChange={(e) => {
          const file = e.target.files[0];
          changeFile(file);
        }} />
    </div>
  );
};
// idx, dName, dType, updater, deleter
SubmittedPage.propTypes = {
  idx: PropTypes.number.isRequired,
  dName: PropTypes.string,
  dType: PropTypes.number.isRequired,
  updater: PropTypes.func.isRequired,
  deleter: PropTypes.func.isRequired
};

const Submit = ({match}) => {

  const [client, setClient] = useState(undefined);
  const [className, setClassName] = useState("");
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState({id: -1, title: "No assignments to submit!", desc: "", due: 0});
  const [submitted, setSubmitted] = useState([]);
  const [success, setSuccess] = useState(false);

  // const h = useHistory();
  const classID = match.params.classID;

  const updater = (idx, val) => {
    const copy = submitted.slice(0);
    const i = copy.findIndex((c) => c.idx === idx);
    copy[i] = val;
    if (i === submitted.length - 1) {
      copy.push({
        idx: copy[copy.length - 1].idx + 1,
        dFile: undefined,
        dName: "",
        dType: FILE_TYPES.EMPTY});
    }
    setSubmitted(copy);
  };

  const deleter = (idx) => {
    const copy = submitted.slice(0);
    const i = copy.findIndex((c) => c.idx === idx);
    copy.splice(i, 1);
    setSubmitted(copy);
  };

  useEffect(() => {
    const client = new Client();
    setClient(client);
    client.getClass(classID).then((res) => setClassName(res.name));
    client.getAssignments(classID).then((res) => {
      if (res.length === 0) return;
      const options = res.map((r) => {
        return {value: r, label: r.title};
      });
      setOptions(options);
    });
    setSubmitted([{idx: 0, dFile: undefined, dName: "", dType: FILE_TYPES.EMPTY}]);
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
            <div className="user-input">
              <span className="assignment-header">{selected.name || "Select an assignment to submit"}</span><br />
              {submitted.map((p) => {
                return <SubmittedPage key={p.idx}
                  idx={p.idx}
                  dName={p.dName}
                  dType={p.dType}
                  updater={updater}
                  deleter={deleter} />;
              })}
            </div>
            <div className="selector">
              <Select options={options} onChange={(v) => setSelected(v.value)} />
              <span className="selected-desc">{selected.desc}</span><br />
              <span className="selected-due">{selected.due === 0 ? "" : `Due ${new Date(selected.due).toLocaleString()}`}</span>
            </div>
            <div className="submit-wrap">
              <div title="This will override any previous submission!"
                className={`submit-assignment${submitted.length > 1 && selected.id !== -1 ? " submit-active" : ""}`}
                onClick={async () => {
                  if (submitted.length === 0 || selected.id === -1) return;
                  await client.submitAssignment(classID, selected.id, submitted.slice(0, -1).map((s) => s.dFile));
                  setSuccess(true);
                }}>
                Submit
              </div>
            </div>
            <div className="submit-success" style={{display: success ? "block" : "none"}}>
              Your pages were successfully submitted!
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
