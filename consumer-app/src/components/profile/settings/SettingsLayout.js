import React from "react";
import ResetPassword from "../../UserForms/ResetPassword";
import BackupWallet from "../../UserForms/BackupWallet";
import { useRouteMatch, NavLink } from "react-router-dom";
// import Settings from "./index";

function SettingsLayout() {
  let { url } = useRouteMatch();

  // const [route, setRoute] = useState("edit");

  // const link = (route) => {
  //   if (route === "undefined") {
  //     setRoute("edit");
  //   } else if (route === "edit") {
  //     setRoute("edit");
  //   } else if (route === "link") {
  //     setRoute("link");
  //   } else if (route === "deactivate") {
  //     setRoute("deactivate");
  //   }
  // };
  return (
    <div>
      <div className="wrapper">
        <div className="content-wrap">
          <div className="settings-content">
            <div className="row">
              <div className="col-lg-5 col-md-4">
                <div className="settings-links">
                  <h3>Settings</h3>
                  <ul className="nav sidebar-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <NavLink
                        to={`${url}/edit`}
                        activeClassName="active"
                        id="edit-tab"
                        className="nav-link"
                      >
                        Edit profile
                        <div className="radio_tab" />
                      </NavLink>
                    </li>
                    <li className="nav-item" role="presentation">
                      <NavLink
                        to={`${url}/link`}
                        activeClassName="active"
                        id="link-tab"
                        className="nav-link"
                      >
                        Linked Accounts
                        <div className="radio_tab" />
                      </NavLink>
                    </li>

                    <li className="nav-item" role="presentation">
                      <NavLink
                        activeClassName="active"
                        id="edit-tab"
                        className="nav-link"
                        to={`${url}/deactivate`}
                      >
                        Deactivate Account
                        <div className="radio_tab" />
                      </NavLink>
                    </li>
                    <li className="nav-item" role="presentation">
                      <BackupWallet />
                    </li>
                    <li
                      className="nav-item"
                      role="presentation"
                      onClick={() => {}}
                    >
                      <ResetPassword />
                    </li>
                    <li className="nav-item" role="presentation">
                      <NavLink
                        activeClassName="active"
                        id="edit-tab"
                        className="nav-link"
                        to={`${url}/addEmail`}
                      >
                        Your Account
                        <div className="radio_tab" />
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-7 col-md-8">
                {/* <Switch>
                  <Route exact path={path}>
                    <Settings link={link} />
                  </Route>
                  <Route exact path={`${path}/:topicId`}>
                    <Settings link={link} />
                  </Route>
                </Switch> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsLayout;
