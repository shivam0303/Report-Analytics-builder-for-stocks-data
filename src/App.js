import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Sidebar from "./pages/sidebar/Sidebar";
import Data from "./pages/data/Data";
import Dashboard from "./pages/dashboard/Dashboard";
import ProfileForm from "./pages/profile/ProfileForm";
import CalendarPage from "./pages/calendar/CalendarPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/data" component={Data} />
          <Route path="/form" component={ProfileForm} /> 
          <Route path="/calendar" component={CalendarPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
