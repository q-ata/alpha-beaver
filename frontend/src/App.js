import React from "react";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import "./styles/global.css";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/"><Redirect to="/login" /></Route>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/dashboard" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
};


export default App;