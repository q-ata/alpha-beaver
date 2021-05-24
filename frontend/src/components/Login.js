import React from "react";
import {Link, useHistory} from "react-router-dom";
import "../styles/login.css";
import {useEffect, useState} from "react";
import AsyncSelect from "react-select/async";
import Cookies from "js-cookie";

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

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lastSearch, setLastSearch] = useState(Date.now());
  const [showError, setShowError] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(
    Cookies.get("school-id") ? JSON.parse(Cookies.get("school-id")) : ""
  );
  const [emblem, setEmblem] = useState(
    Cookies.get("school-emblem") ? JSON.parse(Cookies.get("school-emblem")) : ""
  );

  useEffect(() => {
    document.title = "Login";
  });

  const getSchoolList = async (q) => {
    if (Date.now() - lastSearch < 1000) await delay(1000 - Date.now() + lastSearch);
    const schoolList = await fetch(`http://159.89.127.1:3000/schools?q=${q}`);
    const data = await schoolList.json();
    setLastSearch(Date.now());
    const ret = data.schools.map((s) => {
      return {value: s.id, label: s.name};
    });
    return ret;
  };

  const changeSchool = (s) => {
    setSelectedSchool(s);
    const fetchEmblem = async () => {
      const emResult = await fetch(`http://159.89.127.1:3000/emblem?q=${s.value}`);
      const urlObj = await emResult.json();
      setEmblem(urlObj.url);
    };
    fetchEmblem();
  };

  const h = useHistory();
  const submitLogin = (e) => {
    e.preventDefault();
    const getToken = async () => {
      const res = await fetch("http://159.89.127.1:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      const data = await res.json();
      if (data.error) return setShowError(true);

      Cookies.set("auth-token", data, {sameSite: "Lax"});
      
      h.push("/dashboard");
    };
    getToken();
  };

  return (
    <div className="login-page content">

      <div className="top-bar">
        AlphaBeaver
      </div>
      <div className="content-container">

        <div className="login-section">
          <label htmlFor="username" className="username-label">Username</label>
          <input type="text" className="login-field" value={username} onChange={(e) => setUsername(e.target.value)}/> <br />
          <label htmlFor="password" className="password-label">Password</label>
          <input type="password" className="login-field" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <span className="invalid-password" style={{display: showError ? "block" : "none"}}>Incorrect Username or Password</span>
          <div className="remember-me">
            <input type="checkbox" className="remember-me-box" />
            <span className="remember-me-label">Remember Me</span>
          </div>
          <Link className="login" to="#" onClick={submitLogin}>Login</Link>
        </div>

        <div className="school-section">
          <AsyncSelect cacheOptions defaultOptions
            styles={selectStyle}
            loadOptions={getSchoolList}
            formatOptionLabel={(data) => {
              return (
                <div className="school-option">
                  <span className="school-name-option" dangerouslySetInnerHTML={{ __html: data.label }} />
                  <span className="school-id-option" dangerouslySetInnerHTML={{ __html: `#${data.value}` }} />
                </div>
              );
            }}
            value={selectedSchool}
            onChange={changeSchool}
          />
          <img className="emblem" src={emblem} alt="" />

        </div>

      </div>

    </div>
  );
};

export default Login;
