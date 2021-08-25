/* eslint-disable */

import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Navigation from "./Navigation";
import ClassNav from "./ClassNav";
import "../styles/modules.css";
import "../styles/list.css";
import Client from "./beaverjs";
import { useHistory } from "react-router-dom";


const PageList = ({ match }) => {
    const h = useHistory();
    const [list, setList] = useState([]);
    const [classInfo, setClassInfo] = useState({});

    //const classID = match.params.classID;
    const classID = 1;

    const pageClick = (page) => {
        h.push("/content/" + classID + "/" + page.id + "/view");
    };

    useEffect(() => {
        const client = new Client();
        client.getClass(classID).then(setClassInfo);
        client.getPageList(classID).then(setList);
    }, []);

    return (
        <div className="course-page">
            <div className="big-box">
                <div className="header">
                    {classInfo.name}
                </div>
                <div className="header">
                </div>
                <Navigation />
                <div className="middle-section" style={{ width: "calc(100% - 112px)" }}>
                    <ClassNav />
                    <div className="list">
                        <div className="list-header">Pages.</div>
                        {list.map((page) => (
                            <div className="list-item">
                                <a onClick={() => { pageClick(page) }}>
                                    Page ID: {page.id}
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
    // match: PropTypes.object.isRequired
};

export default PageList;