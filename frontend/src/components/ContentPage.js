import {React, useState, useEffect} from "react";
import PropTypes from "prop-types";
import {useHistory} from "react-router-dom";
import Navigation from "./Navigation";
import ContentModule from "./ContentModule";
import ClassNav from "./ClassNav";
import Client from "./beaverjs";
import "../styles/modules.css";

const ContentPage = ({match}) => {

  const [protoMods, setProtoMods] = useState([]);
  const [changed, setChanged] = useState(false);
  const [previous, setPrevious] = useState([]);
  const [classInfo, setClassInfo] = useState({});
  const [client, setClient] = useState(undefined);
  const [canEdit, setCanEdit] = useState(false);

  const classID = match.params.classID;
  const contentID = match.params.contentID;
  const h = useHistory();

  const setter = (val) => {
    if (!changed) setPrevious(protoMods.slice(0));
    setProtoMods(val);
    setChanged(true);
  };

  const inserter = (idx) => {
    // TODO: Lazy, don't use alert.
    if (changed) return alert("Save or discard your changes first!");
    h.push(`/class/${classID}/${contentID}/add?insertAfter=${idx}`);
  };

  const updateSettings = (val, idx) => {
    // Since settings is a nested property, we need a deep clone. Apparently states are mutable within the same scope.
    const mods = JSON.parse(JSON.stringify(protoMods));
    mods[idx].data = val;
    if (!changed) setPrevious(protoMods.slice(0));
    setProtoMods(mods);
    setChanged(true);
  };

  let idx = -1;

  useEffect(() => {
    const client = new Client();
    setClient(client);
    client.getClass(classID).then((info) => {
      if (info.error) h.push("/login");
      else setClassInfo(info);
    });
    client.getContentModules(classID, contentID).then((res) => {
      if (res.error) h.push("/login");
      else {
        setProtoMods(res);
        setPrevious(res);
      }
    });
    client.getClassPermissions(classID).then((perms) => {
      setCanEdit(perms.has("MANAGE_CONTENT"));
    });
    window.addEventListener("resize", () => {
      for (const vid of document.getElementsByClassName("content-youtube")) {
        vid.style.height = `${parseInt(vid.offsetWidth * 9 / 16)}px`;
      }
    });
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
        <div className="middle-section" style={{width: "calc(100% - 112px)"}}>
          <ClassNav classID={classID} />
          <div className="content-modules">
            {protoMods.map((m) => {
              idx++;
              return <ContentModule key={idx}
                module={m}
                idx={idx}
                all={protoMods}
                setter={setter}
                inserter={inserter}
                updateSettings={updateSettings}
                canEdit={canEdit} />;
            })}
          </div>
        </div>
        <div className="changes-popup save-changes" style={{display: changed ? "block" : "none"}} onClick={async () => {
          // TODO: This can be optimized by only changing the modules that were updated client side
          await Promise.all([client.setModules(classID, protoMods), client.setPageModules(classID, contentID, protoMods.map((m) => m.id))]);
          window.location.reload();
        }}>
          Save Changes
        </div>
        <div className="changes-popup discard-changes" style={{display: changed ? "block" : "none"}} onClick={() => {
          setProtoMods(previous.slice(0));
          setChanged(false);
        }}>
          Discard Changes
        </div>
      </div>
    </div>
  );
};

ContentPage.propTypes = {
  match: PropTypes.object.isRequired
};

export default ContentPage;
