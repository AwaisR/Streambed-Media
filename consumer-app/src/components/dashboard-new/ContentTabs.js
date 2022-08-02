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
import ContentStream from "./ContentStream";
import UserStream from "./UserStream";
function ContentTabs(props) {
  const [activeTab, setActiveTab] = useState("content-stream");

  const { collaboratorSnippet } = props;

  return (
    <>
      <h3 className="dashboard-heading d-none d-sm-block">Select Content</h3>
      <Nav className="content-tabs" tabs>
        <NavItem>
          <NavLink
            className={classnames(
              { active: activeTab == "content-stream" },
              "content-nav"
            )}
            onClick={() => {
              setActiveTab("content-stream");
            }}
          >
            Content Stream
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames(
              { active: activeTab == "user-stream" },
              "content-nav"
            )}
            onClick={() => {
              setActiveTab("user-stream");
            }}
            id="userStream"
          >
            User Stream
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="content-stream">
          <Card body className="content-stream" id="contentStream">
            <Row className="no-gutters">
              <Col sm="12">
                <ContentStream collaboratorSnippet={collaboratorSnippet} />
              </Col>
            </Row>
          </Card>
        </TabPane>
        <TabPane tabId="user-stream">
          <Card body className="content-stream" id="contentStream">
            <Row>
              <Col sm="12">
                <UserStream />
              </Col>
            </Row>
          </Card>
        </TabPane>
      </TabContent>
    </>
  );
}

export default ContentTabs;
