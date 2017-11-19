import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home/Home";
import Coffee from "./containers/Coffee/Coffee";
import LoginForm from "./containers/Login/LoginForm";
import Signup from "./containers/Signup/Signup";
import NewProduct from "./containers/NewProduct/NewProduct";
import Category from "./containers/Category/Category";
import Categories from "./containers/Categories/Categories";
import Product from "./containers/Product/Product";
import NotFound from "./containers/NotFound";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/products/:category/:id" component={Product} props={childProps} />
    <AppliedRoute path="/products/:category" component={Category} props={childProps} />
    <AppliedRoute path="/products" exact component={Categories} />
    <AppliedRoute path="/login" exact component={LoginForm} props={childProps} />
    <AppliedRoute path="/admin" exact component={Coffee} props={childProps} />
    <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
    <AppliedRoute path="/create" exact component={NewProduct} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;