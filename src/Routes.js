import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home/Home";
import Coffee from "./containers/Coffee/Coffee";
import Cakes from "./containers/Cakes/Cakes";
import LoginForm from "./containers/Login/LoginForm";
import NotFound from "./containers/NotFound";


export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/coffee" exact component={Coffee} />
    <Route path="/cakes" exact component={Cakes} />
    <Route path="/login" exact component={LoginForm} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;