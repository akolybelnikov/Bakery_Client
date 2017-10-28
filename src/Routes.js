import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home/Home";
import Coffee from "./containers/Coffee/Coffee";
import Cakes from "./containers/Cakes/Cakes";
import LoginForm from "./containers/Login/LoginForm";
import NotFound from "./containers/NotFound";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <Route path="/coffee" exact component={Coffee} />
    <Route path="/cakes" exact component={Cakes} />
    <AppliedRoute path="/login" exact component={LoginForm} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;