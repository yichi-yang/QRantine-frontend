import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import FrontPage from "./components/FrontPage";
import AddPage from "./components/AddPage";
import LocationsPage from "./components/LocationsPage";
import "semantic-ui-css/semantic.min.css";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={FrontPage} />
        <Route path="/login/" exact component={LoginPage} />
        <Route path="/locations/" exact component={LocationsPage} />
        <Route
          path="/add/:plus_code/"
          exact
          render={routeProps => (
            <AddPage plus_code={routeProps.match.params.plus_code} />
          )}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
