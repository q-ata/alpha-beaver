import {React, useEffect, useState} from "react";
import PropTypes from "prop-types";
import Navigation from "./Navigation";
import ClassNav from "./ClassNav";
import "../styles/modules.css";
import "../styles/list.css";
import Client from "./beaverjs";
import {useHistory} from "react-router-dom";

const PageList = ({match}) => {
  const h = useHistory();
  const [list, setList] = useState([]);
  const [classInfo, setClassInfo] = useState({});
  const classID = match.params.classID;

  const pageClick = (page) => {
    h.push(`/class/${classID}/${page.id}/view`);
  };

  useEffect(() => {
    const client = new Client();
    client.getClass(classID).then((info) => {
      if (info.error) {
        h.push("/login");
      } else {
        setClassInfo(info);
      }
    });
    client.getPageList(classID).then((pages) => {
      if (pages.error) {
        h.push("/login");
      } else {
        setList(pages);
      }
    });
  }, []);

  return (
    <div className="course-page">
      <div className="big-box">
        <div className="header">{classInfo.name}</div>
        <div className="header"></div>
        <Navigation />
        <div className="middle-section" style={{width: "calc(100% - 112px)"}}>
          <ClassNav classID={classID} />
          <div className="list">
            <div className="list-header">
              {list.length ? "Pages." : "No pages found."}
            </div>
            {list.map((page, i) => (
              <div key={i} className="list-item" style={{width: "100%"}}>
                <a
                  onClick={() => {
                    pageClick(page);
                  }}
                >
                  {page.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

PageList.propTypes = {
  match: PropTypes.object.isRequired
};

export default PageList;
