import React from "react";
import {Link, useHistory} from "react-router-dom";
import "../styles/form.css";
import "../styles/login.css";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import SchoolSearch from "./SchoolSearch";


const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  useEffect(() => {
    document.title = "Login";
  });

  const h = useHistory();
  const submitLogin = (e) => {
    e.preventDefault();
    if (!selectedSchool.label.length) {
      setErrorMessage("No school selected!");
      setShowError(true);
      return;
    }
    setShowError(false);
    const getToken = async () => {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password,
          school: selectedSchool,
          rememberMe
        })
      });
      const data = await res.json();
      if (data.error) {
        setErrorMessage(data.msg);
        setShowError(true);
        return;
      }

      Cookies.set("auth_token", data.token, {sameSite: "Strict"});
      
      h.push("/dashboard");
    };
    getToken();
  };

  return (
    <div className="login-page form-page content">

      <div className="top-bar">
        AlphaBeaver - Login
      </div>
      <div className="content-container">

        <div className="form-section">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" className="form-field" value={username} onChange={(e) => setUsername(e.target.value)}/> <br />
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-field" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <span className="error-message" style={{display: showError ? "block" : "none"}}>{errorMessage}</span>
          <div className="remember-me">
            <input type="checkbox" className="remember-me-box" onChange={() => setRememberMe(!rememberMe)} />
            <span className="remember-me-label">Remember Me</span>
          </div>
          <Link className="submit-form" to="#" onClick={submitLogin}>Login</Link>
        </div>

        <SchoolSearch onChange={setSelectedSchool} />
        <Link className="go-prereq" to="/register" onClick="">Register</Link>

      </div>

    </div>
  );
};

export default Login;
