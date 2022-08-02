import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

import "./AppResponsive.css";
import "./App.css";

// import Login from "./login";
import Login from "../pages/login/Login";
import Signup from "../pages/signup/Signup";
import Verify from "./login/Verify";
import Logout from "./login/Logout";

import ContentStream from "../pages/dashboard/ContentStream";
import Content from "../pages/dashboard/Content";
import Overview from "../pages/dashboard/Overview";
// import NewDashboard from "./dashboard-new/NewDashboard";
// import VideoUpload from "./video-upload";
import Upload from "../pages/dashboard/Upload";
import Analytics from "../pages/dashboard/Analytics";
import ViewProfile from "../pages/dashboard/profile/ViewProfile";
import EditProfile from "../pages/dashboard/profile/EditProfile";
import LinkedAccounts from "../pages/dashboard/profile/LinkedAccounts";
// import CreateUserForm from "./UserForms/CreateUserForm";
import ProtectedRoute from "./ProtectedRoute";
import Oauth2callback from "./oauth2callback";
import ZoomOauth2callback from "./Zoomoauth2callback";

import TwitterCallBackHandler from "./helpers/TwitterCallBackHandler";

// import Profile from "./profile/view";
import { Switch, Route } from "react-router-dom";

import SettingsLayout from "./profile/settings/SettingsLayout";

import TwitterHome from "./twitter-upload/index";
import FacebookHome from "./facebook-upload/index";
import LinkedinHome from "./linkedin-upload/index";
import MobileDevicePopup from "./MobileDevicePopup";
import ForgotPwd from "./profile/reset-password/ForgotPwd";
import ResetPassword from "./profile/reset-password/ResetPassword";
// import Landing from "./home/Landing";
import Landing from "../pages/dashboard/Landing";
import Settings from "../pages/dashboard/Settings/Settings.jsx";
import InstagramRedirectHandler from "./helpers/InstagramRedirectHandler";
import Collaborator from "./instagram-upload/Collaborator";
import FacebookRedirectHandler from "./helpers/FacebookRedirectHandler";
import LinkedInRedirectHandler from "./helpers/LinkedInRedirectHandler";

function App() {
  const [mobileDevice, setMobileDevice] = React.useState("true");
  React.useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      localStorage.setItem("mobile", true);
      setMobileDevice(localStorage.getItem("mobile"));
    } else {
      localStorage.setItem("mobile", false);
      setMobileDevice(localStorage.getItem("mobile"));
    }
  }, []);

  if (mobileDevice === "true") {
    return <MobileDevicePopup goToDesktop={() => setMobileDevice("false")} />;
  }
  return (
    <div className="App">
      <Switch>
        <Route exact path="/forget-password">
          <ForgotPwd />
        </Route>
        <Route exact path="/reset-password">
          <ResetPassword />
        </Route>
        <Route exact path="/">
          <Login />
        </Route>

        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/account/active/:email?/:expiryToken?/:expiryTime?">
          <Verify />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/logout">
          <Logout />
        </Route>

        <ProtectedRoute exact path="/home" component={Landing}></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/overview"
          component={Overview}
        ></ProtectedRoute>
        <ProtectedRoute
          path="/content/twitter/:contentId"
          component={Content}
          exact
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/content"
          component={ContentStream}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/analytics"
          component={Analytics}
        ></ProtectedRoute>

        <ProtectedRoute
          exact
          path="/video-upload"
          component={Upload}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/auth2callback"
          component={Oauth2callback}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/zoom-callback"
          component={ZoomOauth2callback}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/instagram-auth2callback"
          component={InstagramRedirectHandler}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/facebook-auth2callback"
          component={FacebookRedirectHandler}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/auth/linkedin/callback"
          component={LinkedInRedirectHandler}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/api/twitter-callback"
          component={TwitterCallBackHandler}
        ></ProtectedRoute>
        <ProtectedRoute
          path="/twitter/post-upload"
          component={TwitterHome}
        ></ProtectedRoute>
        <ProtectedRoute
          path="/facebook/post-upload"
          component={FacebookHome}
        ></ProtectedRoute>
        <ProtectedRoute
          path="/linkedin/post-upload"
          component={LinkedinHome}
        ></ProtectedRoute>
        <ProtectedRoute
          path="/instagram/add-post-coll"
          component={Collaborator}
        ></ProtectedRoute>

        <ProtectedRoute
          exact
          path="/profile"
          component={ViewProfile}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/profile/edit"
          component={EditProfile}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/profile/linked-accounts"
          component={LinkedAccounts}
        ></ProtectedRoute>
        <ProtectedRoute path="/settings" component={Settings}></ProtectedRoute>
        <ProtectedRoute
          path="/users/account/emailActive/:userID?/:activeToken?/:expiryTime?"
          component={SettingsLayout}
        ></ProtectedRoute>
      </Switch>
    </div>
  );
}

export default App;
