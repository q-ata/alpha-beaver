import React from "react";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Class from "./components/Class";
import ModuleCreator from "./components/ModuleCreator";
import ContentPage from "./components/ContentPage";
import Upcoming from "./components/Upcoming";
import PageList from "./components/PageList";
import AddAnnouncement from "./components/AnnouncementCreate";
import AddEvent from "./components/EventCreate";
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
        <Route exact path="/content/:classID/events/add" component={AddEvent} />
        <Route exact path="/content/:classID/announcements/add" component={AddAnnouncement} />
        <Route exact path="/content/:classID/:contentID/view" component={ContentPage} />
        <Route exact path="/content/:classID/:contentID/add" component={ModuleCreator} />
        <Route exact path="/content/:classID/all" component={PageList} />
        <Route exact path="/upcoming" component={Upcoming} />
        <Route><Redirect to="/dashboard" /></Route>
      </Switch>
    </BrowserRouter>
  );
};


export default App;