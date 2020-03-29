import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import "semantic-ui-css/semantic.min.css";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login/" exact component={LoginPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
