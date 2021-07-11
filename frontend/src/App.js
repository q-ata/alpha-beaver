import React from "react";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Class from "./components/Class";
import ContentEditor from "./components/ContentEditor";
import "./styles/global.css";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/"><Redirect to="/login" /></Route>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/class"><Redirect to="/login" /></Route>
        <Route path="/class/:classID" component={Class} />
        <Route exact path="/content" component={ContentEditor} />
      </Switch>
    </BrowserRouter>
  );
};


export default App;