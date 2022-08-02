import React, { useState } from "react";

import "./dashboard.css";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Row,
  Col,
} from "reactstrap";
import classnames from "classnames";
import Analytics from "./Analytics";
import NewOverView from "./NewOverview";
import Activity from "./Activity";
import ContentTabs from "../../components/dashboard-new/ContentTabs";

function DashboardTabs(props) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <h3 className="dashboard-heading">Dashboard</h3>
      <button
        onClick={() => openNav(true)}
        className="btn-secondary filtersButton d-sm-none"
      >
        Filters
      </button>
      <div className="d-none d-md-block">
        <Nav tabs>
          <NavItem className="nav-item-width">
            <NavLink
              className={classnames({ active: activeTab === "overview" })}
              onClick={() => {
                setActiveTab("overview");
              }}
            >
              Overview
            </NavLink>
          </NavItem>
          <NavItem className="nav-item-width">
            <NavLink
              className={classnames({ active: activeTab === "analytics" })}
              onClick={() => {
                setActiveTab("analytics");
              }}
            >
              Insights
            </NavLink>
          </NavItem>

          <NavItem className="nav-item-width">
            <NavLink
              className={classnames({ active: activeTab === "activity" })}
              onClick={() => {
                setActiveTab("activity");
              }}
            >
              Activity
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="overview">
            <Card id="dash-board-tour" body className="content-stream">
              <NewOverView {...props} />
            </Card>
          </TabPane>
          <TabPane tabId="analytics">
            <Card body className="content-stream">
              <Row>
                <Col m="12">
                  <Analytics loaded={props.loaded} />
                </Col>
              </Row>
            </Card>
          </TabPane>
          <TabPane tabId="activity">
            <Card body className="content-stream">
              <Row>
                <Col m="12">
                  <Activity />
                </Col>
              </Row>
            </Card>
          </TabPane>
        </TabContent>
      </div>

      {/* Mobile version of dashboard analytics */}
      <div className="d-block d-md-none">
        {/* <Nav tabs> */}
        {/* <NavItem className="nav-item-width">
          <NavLink>
            Overview
          </NavLink>
        </NavItem> */}

        <h3 className="mobileSectionTitles">Overview</h3>

        <TabPane tabId="overview" className="mt-2">
          <Card id="dash-board-tour" body className="content-stream p-md-2">
            <NewOverView {...props} />
          </Card>
        </TabPane>

        <h3 className="mobileSectionTitles mt-2">Insights</h3>

        <TabPane tabId="analytics" className="mt-2">
          <Card body className="content-stream">
            <Row>
              <Col m="12">
                <Analytics loaded={props.loaded} />
              </Col>
            </Row>
          </Card>
        </TabPane>

        <h3 className="mobileSectionTitles mt-2">Activity</h3>
        {/* </Nav> */}

        <TabPane tabId="activity" className="mt-2">
          <Card body className="content-stream">
            <Row>
              <Col m="12">
                <Activity />
              </Col>
            </Row>
          </Card>
        </TabPane>
      </div>

      <div id="contentFilters" className="filtersPanel">
        <div className="closebtn" onClick={closeNav}>
          <i className="fas fa-chevron-right"></i>
        </div>
        <h2>
          <img
            className="mr-2"
            src={require("../../assets/images/filtersIconWhite.svg")}
          ></img>
          Filters
        </h2>
        <hr className="filtersBreak"></hr>
        <p>
          Use your Content Stream and User Stream to toggle the data on your
          dashboard, so you can get a better understanding of how your content
          is performing.
        </p>
        <div className="contentDiv">{ContentTabs(props)}</div>
      </div>
    </div>
  );
}

function openNav() {
  document.getElementById("contentFilters").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("contentFilters").style.width = "0px";
}

export default DashboardTabs;
