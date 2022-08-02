import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "Components/Login/Login";
import Verify from "Components/Login/Varify";
import Signup from "Components/SignUp/Signup";
import ForgetPassword from "Components/ForgetPassword/ForgetPassword";
import ForgetPaword from "Components/ForgetPassword/ForgetPaword";
import Sidebar from "Components/Dashboard/Sidebar/Sidebar";
import Setting from "Components/Dashboard/Settings";
import Magnify from "Components/Dashboard/Magnify";
import Overview from "Components/Dashboard/Overview/Overview";
import Campaigns from "Components/Dashboard/Campaigns";
import Analytics from "Components/Dashboard/Analytics";
import Wallet from "Components/Dashboard/Wallet";
import EditProfile from "Components/Dashboard/Settings/EditProfile";
import ProtectedRoute from "Components/ProtectedRoute/Protected";
const Layout = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/forget-password" component={ForgetPassword} />
          <Route
            exact
            path="/users/account/forgot-password/:email?/:expiryToken?/:expiryTime?"
            component={ForgetPaword}
          />
          <Route
            exact
            path="/account/active/:email?/:expiryToken?/:expiryTime?"
            component={Verify}
          />
          <ProtectedRoute exact path="/dashboard" component={Overview} />
          <ProtectedRoute
            exact
            path="/dashboard/settings"
            component={Setting}
          />
          <ProtectedRoute exact path="/dashboard/magnify" component={Magnify} />
          <ProtectedRoute
            exact
            path="/dashboard/overview"
            component={Overview}
          />
          <ProtectedRoute
            exact
            path="/dashboard/analytics"
            component={Analytics}
          />
          <ProtectedRoute
            exact
            path="/dashboard/campaigns"
            component={Campaigns}
          />
          <ProtectedRoute exact path="/dashboard/wallets" component={Wallet} />
        </Switch>
      </Router>
    </>
  );
};
export default Layout;
