import React from "react";
import {Link, useHistory} from "react-router-dom";
import "../styles/form.css";
import {useEffect, useState} from "react";
import SchoolSearch from "./SchoolSearch";

const delay = (interval) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, interval);
  });
};

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [requireName, setRequireName] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState({});

  useEffect(() => {
    document.title = "Register";
  });

  const changeSchool = (s) => {
    setSelectedSchool(s);
    setRequireName(s.value.requireName);
  };

  const h = useHistory();
  const tryRegister = (e) => {
    e.preventDefault();
    if (!selectedSchool.label) {
      setErrorMessage("No school selected!");
      setShowError(true);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setShowError(true);
      return;
    }
    setShowError(false);
    const sendRequest = async () => {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password,
          school: selectedSchool.value.id,
          firstName,
          lastName
        })
      });
      const data = await res.json();
      if (data.error) {
        setErrorMessage(data.msg);
        setShowError(true);
        return;
      }
      setSuccess(true);
      setErrorMessage("Successfully registered! Redirecting to login page.");
      setShowError(true);
      await delay(2000);
      h.push("/login");
    };
    sendRequest();
  };

  return (
    <div className="form-page content">

      <div className="top-bar">
        AlphaBeaver - Register
      </div>
      <div className="content-container">

        <div className="form-section">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" className="form-field" value={username} onChange={(e) => setUsername(e.target.value)}/> <br />
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-field" value={password} onChange={(e) => setPassword(e.target.value)}/> <br />
          <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
          <input type="password" className="form-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/> <br />
          <label htmlFor="firstName" className="form-label" style={{display: requireName ? "inline-block" : "none"}}>First Name</label>
          <input type="text" className="form-field" value={firstName} style={{display: requireName ? "inline-block" : "none"}} onChange={(e) => setFirstName(e.target.value)}/> <br />
          <label htmlFor="lastName" className="form-label" style={{display: requireName ? "inline-block" : "none"}}>Last Name</label>
          <input type="text" className="form-field" value={lastName} style={{display: requireName ? "inline-block" : "none"}} onChange={(e) => setLastName(e.target.value)}/>
          <span className="error-message" style={{display: showError ? "block" : "none", color: success ? "green" : "red"}}>{errorMessage}</span>
          <Link className="submit-form" to="#" onClick={tryRegister}>Register</Link>
        </div>

        <SchoolSearch onChange={changeSchool} />
        <Link className="go-prereq" to="/login" onClick="">Login</Link>

      </div>

    </div>
  );
};

export default Login;
