import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import asyncComponent from "./components/AsyncComponent";

const AsyncHome = asyncComponent(() => import("./containers/Home/Home"));
const AsyncLoginForm = asyncComponent(() => import("./containers/Login/LoginForm"));
const AsyncSignup = asyncComponent(() => import("./containers/Signup/Signup"));
const AsyncNewProduct = asyncComponent(() => import("./containers/NewProduct/NewProduct"));
const AsyncCategory = asyncComponent(() => import("./containers/Category/Category"));
const AsyncCategories = asyncComponent(() => import("./containers/Categories/Categories"));
const AsyncUpdateProduct = asyncComponent(() => import("./containers/Admin/UpdateProduct"));
const AsyncProduct = asyncComponent(() => import("./containers/Product/Product"));
const AsyncAdminDashBoard = asyncComponent(() => import("./containers/Admin/DashBoard"));
const AsyncCategoryView = asyncComponent(() => import("./containers/Admin/CategoryView"));
const AsyncNews = asyncComponent(() => import("./containers/News/News"));
const AsyncNewOffer = asyncComponent(() => import("./containers/Admin/NewOffer"));
const AsyncNewsForm = asyncComponent(() => import("./containers/Admin/NewsForm"));
const AsyncNewsView = asyncComponent(() => import("./containers/Admin/NewsView"));
const AsyncUpdateNews = asyncComponent(() => import("./containers/Admin/UpdateNews"));
const AsyncContact = asyncComponent(() => import("./components/Contact"));
const AsyncNotFound = asyncComponent(() => import("./containers/NotFound"));

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={AsyncHome} props={childProps} />
    <AppliedRoute path="/products/:category/:id" exact component={AsyncProduct} props={childProps} />
    <AppliedRoute path="/products/:category" exact component={AsyncCategory} props={childProps} />
    <AppliedRoute path="/products" exact component={AsyncCategories} props={childProps} />
    <AppliedRoute path="/contact" exact component={AsyncContact} props={childProps} />
    <AppliedRoute path="/news" exact component={AsyncNews} props={childProps} />
    <UnauthenticatedRoute path="/login" component={AsyncLoginForm} props={childProps} />
    <UnauthenticatedRoute path="/signup" component={AsyncSignup} props={childProps} />
    <AuthenticatedRoute path="/admin/news" exact component={AsyncNewsView} props={childProps} />
    <AuthenticatedRoute path="/admin/news/:id" component={AsyncUpdateNews} props={childProps} />
    <AuthenticatedRoute path="/admin/:category" exact component={AsyncCategoryView} props={childProps} />
    <AuthenticatedRoute path="/admin/:category/:id" exact component={AsyncUpdateProduct} props={childProps} />
    <AuthenticatedRoute path="/admin" exact component={AsyncAdminDashBoard} props={childProps} />
    <AuthenticatedRoute path="/create" component={AsyncNewProduct} props={childProps} />
    <AuthenticatedRoute path="/newoffer" component={AsyncNewOffer} props={childProps} />
    <AuthenticatedRoute path="/createnews" component={AsyncNewsForm} props={childProps} />
    <Route component={AsyncNotFound} />
  </Switch>;