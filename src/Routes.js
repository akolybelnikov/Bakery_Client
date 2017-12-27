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
import NewsView from "./containers/Admin/NewsView";
import UpdateNews from "./containers/Admin/UpdateNews";
import Contact from "./components/Contact";
import NotFound from "./containers/NotFound";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/products/:category/:id" exact component={Product} props={childProps} />
    <AppliedRoute path="/products/:category" exact component={Category} props={childProps} />
    <AppliedRoute path="/products" exact component={Categories} props={childProps} />
    <AppliedRoute path="/contact" exact component={Contact} props={childProps} />
    <UnauthenticatedRoute path="/login" component={LoginForm} props={childProps} />
    <UnauthenticatedRoute path="/signup" component={Signup} props={childProps} />
    <AuthenticatedRoute path="/admin/:category" exact component={CategoryView} props={childProps} />
    <AuthenticatedRoute path="/admin/:category/:id" exact component={UpdateProduct} props={childProps} />
    <AuthenticatedRoute path="/admin" exact component={AdminDashBoard} props={childProps} />
    <AuthenticatedRoute path="/create" component={NewProduct} props={childProps} />
    <AuthenticatedRoute path="/newoffer" component={NewOffer} props={childProps} />
    <AuthenticatedRoute path="/createnews" component={NewsForm} props={childProps} />
    <AuthenticatedRoute path="/admin/news" exact component={NewsView} props={childProps} />
    <AuthenticatedRoute path="/updatenews" component={UpdateNews} props={childProps} />
    
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;