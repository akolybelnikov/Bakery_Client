import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Home from "./containers/Home/Home";
import LoginForm from "./containers/Login/LoginForm";
import Signup from "./containers/Signup/Signup";
import NewProduct from "./containers/NewProduct/NewProduct";
import Category from "./containers/Category/Category";
import Categories from "./containers/Categories/Categories";
import Product from "./containers/Product/Product";
import UpdateProduct from "./containers/Admin/UpdateProduct";
import AdminDashBoard from "./containers/Admin/DashBoard";
import CategoryView from "./containers/Admin/CategoryView";
import NewOffer from "./containers/Admin/NewOffer";
import NewsForm from "./containers/Admin/NewsForm";
import NotFound from "./containers/NotFound";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/products/:category/:id" exact component={Product} />
    <AppliedRoute path="/products/:category" exact component={Category} />
    <AppliedRoute path="/products" exact component={Categories} />
    <UnauthenticatedRoute path="/login" component={LoginForm} props={childProps} />
    <UnauthenticatedRoute path="/signup" component={Signup} props={childProps} />
    <AuthenticatedRoute path="/admin/:category" exact component={CategoryView} props={childProps} />
    <AuthenticatedRoute path="/admin/:category/:id" exact component={UpdateProduct} props={childProps} />
    <AuthenticatedRoute path="/admin" exact component={AdminDashBoard} props={childProps} />
    <AuthenticatedRoute path="/create" component={NewProduct} props={childProps} />
    <AuthenticatedRoute path="/newoffer" component={NewOffer} props={childProps} />
    <AuthenticatedRoute path="/createnews" component={NewsForm} props={childProps} />
    
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;