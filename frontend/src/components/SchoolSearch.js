import React from "react";
import {useState} from "react";
import AsyncSelect from "react-select/async";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const delay = (interval) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, interval);
  });
};

const selectStyle = {
  menu: (provided) => ({
    ...provided,
    marginTop: 0
  }),
  option: (provided, {isFocused}) => ({
    ...provided,
    backgroundColor: isFocused ? "lightgrey" : "white",
    color: "black"
  }),
  singleValue: (provided) => ({
    ...provided,
    width: "90%"
  })
};

const SchoolSearch = ({url = "http://localhost:8000/api/schools", onChange = () => {}}) => {

  const [lastSearch, setLastSearch] = useState(Date.now());
  const [selectedSchool, setSelectedSchool] = useState(
    Cookies.get("school-id") ? JSON.parse(Cookies.get("school-id")) : ""
  );
  const [emblem, setEmblem] = useState(
    Cookies.get("school-emblem") ? JSON.parse(Cookies.get("school-emblem")) : ""
  );

  const getSchoolList = async (q) => {
    if (Date.now() - lastSearch < 1000) await delay(1000 - Date.now() + lastSearch);
    const schoolList = await fetch(`${url}?q=${q}`);
    const data = await schoolList.json();
    setLastSearch(Date.now());
    const ret = data.schools.map((s) => {
      return {value: s, label: s.name};
    });
    return ret;
  };

  const changeSchool = (s) => {
    setSelectedSchool(s);
    setEmblem(s.value.emblem);
    onChange(s);
  };

  return (
    <div className="school-section">
      <AsyncSelect cacheOptions defaultOptions
        styles={selectStyle}
        loadOptions={getSchoolList}
        formatOptionLabel={(data) => {
          return (
            <div className="school-option">
              <span className="school-name-option" dangerouslySetInnerHTML={{ __html: data.label }} />
              <span className="school-id-option" dangerouslySetInnerHTML={{ __html: `#${data.value.id}` }} />
            </div>
          );
        }}
        value={selectedSchool}
        onChange={changeSchool}
      />
      <img className="emblem" src={emblem} alt="" />

    </div>
  );

};

SchoolSearch.propTypes = {
  url: PropTypes.string,
  onChange: PropTypes.func
};

export default SchoolSearch;