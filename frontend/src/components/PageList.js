/* eslint-disable */

import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Navigation from "./Navigation";
import ClassNav from "./ClassNav";
import "../styles/modules.css";
import Client from "./beaverjs";


const PageList = ({ match }) => {

    const [list, setList] = useState([]);

    //const classID = match.params.classID;
    const classID = 1;
    const client = new Client();

    useEffect(() => {
        client.getPageList(classID).then((pages) => {
             setList(pages);
        }); 
    })

    return (
        <div className="list">
            <ul>
                {list.map((page)=> (
                    <li key={page.id}><a href="google.com">Link to page:</a> Page ID: {page.id}</li>
                ))}
            </ul>
        </div>
    );
};

PageList.propTypes = {
    // match: PropTypes.object.isRequired
};

export default PageList;
