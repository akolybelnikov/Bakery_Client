import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home/Home";
import LoginForm from "./containers/Login/LoginForm";
import Signup from "./containers/Signup/Signup";
import NewProduct from "./containers/NewProduct/NewProduct";
import Category from "./containers/Category/Category";
import Categories from "./containers/Categories/Categories";
import Product from "./containers/Product/Product";
import UpdateProduct from "./containers/Admin/UpdateProduct";
import AdminDashBoard from "./containers/Admin/DashBoard";
import NotFound from "./containers/NotFound";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/products/:category/:id" exact component={Product} />
    <AppliedRoute path="/products/:category" exact component={Category} />
    <AppliedRoute path="/products" exact component={Categories} />
    <AppliedRoute path="/login" component={LoginForm} props={childProps} />
    <AppliedRoute path="/admin/:id" exact component={UpdateProduct} props={childProps} />
    <AppliedRoute path="/admin" exact component={AdminDashBoard} props={childProps} />
    <AppliedRoute path="/signup" component={Signup} props={childProps} />
    <AppliedRoute path="/create" component={NewProduct} props={childProps} />
    
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;