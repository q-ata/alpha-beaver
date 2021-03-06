import {React, useEffect, useState} from "react";
import PropTypes from "prop-types";
import SettingsIcon from "@material-ui/icons/Settings";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AddIcon from "@material-ui/icons/Add";
import "../styles/module_settings.css";

const TextSetting = ({title, allow, deFault, cb}) => {

  const [content, setContent] = useState(deFault);
  const [exp, setExp] = useState({});

  useEffect(() => {
    setExp(new RegExp(allow));
  }, []);

  return (
    <div className="setting-additional">
      <span className="setting-title">{title}</span>
      <input type="text" className="setting-text" value={content} onChange={(e) => {
        if (exp.test(e.target.value[e.target.value.length - 1])) setContent(e.target.value);
      }}
      onBlur={() => cb(content)} />
    </div>
  );
};
TextSetting.propTypes = {
  title: PropTypes.string.isRequired,
  allow: PropTypes.string.isRequired,
  deFault: PropTypes.string,
  cb: PropTypes.func.isRequired
};

const ToggleSetting = ({title, deFault, cb}) => {

  const [value, setValue] = useState(deFault);

  return (
    <div className="setting-additional">
      <span className="setting-title">{title}</span>
      <input type="checkbox" className="setting-toggle" defaultChecked={deFault} onChange={() => {
        const newValue = !value;
        setValue(newValue);
        cb(newValue);
      }} />
    </div>
  );

};
ToggleSetting.propTypes = {
  title: PropTypes.string.isRequired,
  deFault: PropTypes.bool,
  cb: PropTypes.func.isRequired
};

const NumberSetting = ({title, min, max, unit, deFault, cb}) => {
  
  const [value, setValue] = useState(deFault);

  return (
    <div className="setting-additional">
      <span className="setting-title">{title}</span>
      <div className="setting-number-controller">
        <div className="setting-number-data">
          <input type="text" className="setting-number-box" value={value} onChange={(e) => {
            let v;
            if (e.target.value === "" && !(v = 0)) setValue(0);
            else if (!isNaN(v = parseInt(e.target.value))) setValue(v > max ? max : v);
          }}
          onBlur={() => {
            let v = value;
            if (value < min) v = min;
            else if (value > max) v = max;
            setValue(v);
            cb(v);
          }} />
          <span className="setting-number-unit">{unit}</span>
        </div>
        <input type="range" min={min} max={max} className="setting-number-slider" value={value} onChange={(e) => setValue(e.target.valueAsNumber)} onMouseUp={() => {
          cb(value);
        }} />
      </div>
    </div>
  );

};
NumberSetting.propTypes = {
  title: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  deFault: PropTypes.number,
  cb: PropTypes.func.isRequired
};

const ContentModuleSettings = ({settings, updateSettings, modules, setter, idx, inserter}) => {

  const [additionalSettings, setAdditionalSettings] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [index] = useState(idx);

  const swap = (i1, i2) => {
    if (i1 < 0 || i1 >= modules.length || i2 < 0 || i2 >= modules.length) return false;
    const arr = modules.slice(0);
    const a = arr[i1];
    const b = arr[i2];
    arr[i1] = b;
    arr[i2] = a;
    setter(arr);
    return true;
  };

  const deleter = (i) => {
    const arr = modules.slice(0);
    arr.splice(i, 1);
    setter(arr);
    return true;
  };

  useEffect(() => {
    const addSettings = [];
    let idx = 0;
    for (const setting of settings) {
      let input;
      switch (setting.type) {
      case "text":
        input = <TextSetting title={setting.title} allow={setting.allow} deFault={setting.default} cb={updateSettings[idx++]} />;
        break;
      case "toggle":
        input = <ToggleSetting title={setting.title} deFault={setting.default} cb={updateSettings[idx++]} />;
        break;
      case "number":
        input = <NumberSetting title={setting.title} min={setting.min} max={setting.max} unit={setting.unit} deFault={setting.default} cb={updateSettings[idx++]} />;
        break;
      }
      addSettings.push(input);
    }
    setAdditionalSettings(addSettings);
  }, []);

  return (
    <div className="settings">
      <div className={`settings-icon${showDropdown ? "" : " settings-inactive"}`} onClick={() => setShowDropdown(!showDropdown)}>
        <SettingsIcon />
      </div>
      <div className="settings-dropdown" style={{display: showDropdown ? "block" : "none"}}>
        <div className="setting-tooltip" title="Move Up" onClick={() => swap(index, index - 1)}><ArrowUpwardIcon className="default-setting" /></div>
        <div className="setting-tooltip" title="Move Down" onClick={() => swap(index, index + 1)}><ArrowDownwardIcon className="default-setting" /></div>
        <div className="setting-tooltip" title="Insert After" onClick={() => inserter(index)}><AddIcon className="default-setting" /></div>
        <div className="setting-tooltip" title="Delete Forever" onClick={() => deleter(index)}><DeleteForeverIcon className="default-setting" /></div>
        {additionalSettings}
      </div>
    </div>
  );
};
ContentModuleSettings.propTypes = {
  settings: PropTypes.array.isRequired,
  updateSettings: PropTypes.array.isRequired,
  modules: PropTypes.array.isRequired,
  setter: PropTypes.func.isRequired,
  idx: PropTypes.number.isRequired,
  inserter: PropTypes.func.isRequired
};

export default ContentModuleSettings;