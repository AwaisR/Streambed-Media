import React, { useState, useEffect } from "react";
import "./dashboard.css";
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
  useHistory,
  useLocation,
} from "react-router-dom";
import Overview from "./Overview";
import Video from "./Video";
import Filters from "./Filters";
import ProtectedRoute from "../ProtectedRoute";

function LeftTabs() {
  let { path, url } = useRouteMatch();
  let location = useLocation();

  const youtube = sessionStorage.getItem("VideoData");

  // this is use to show or hide filter component
  const [filter, showFilters] = useState(false);
  const history = useHistory();
  return (
    <div
      onClick={() => {
        {
          filter && showFilters(false);
        }
      }}
    >
      <div className="newdashboard-wrap">
        <div className="dashboard-head">
          <div className="head-container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="head-content">
                  <ul>
                    <li>
                      <Link to="/new/dashboard">Overview </Link>
                    </li>
                    <li>
                      <Link to="/new/dashboard/video">Videos</Link>
                    </li>
                    <li
                      onClick={() => {
                        showFilters(!filter);
                      }}
                    >
                      <a className="btn btn-primary">FILTERS</a>
                    </li>
                  </ul>
                </div>
              </div>
              {location.pathname.split("/")[2] !== "video" ? (
                <div className="col-md-4">
                  <div className="views-box">
                    <div className="views-bars">
                      <span className="view-bar"></span>
                      <span className="view-bar"></span>
                      <span className="view-bar"></span>
                    </div>
                    <p>
                      Total views: <br />
                      1000 views
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {/* <!-- Dashboard Head End --> */}
      </div>

      <Switch>
        <Route exact path={path}>
          <Overview />
        </Route>
        <ProtectedRoute path={`${path}/:route`}>
          <Video youtube={youtube} />
        </ProtectedRoute>
      </Switch>
      <Filters filter={filter} showFilters={showFilters} />
    </div>
  );
}

export default LeftTabs;
