import react, { useEffect, useState } from "react";
import "./overview.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownToggle, Row, Col } from "react-bootstrap";
import { overviewAction } from "store/overview/action";
import { useSelector, useDispatch } from "react-redux";
import Profile from "Containers/Profile";
import CoprateUser from "Containers/CoprateUser";
import CenterComp from "./CenterComp";
import Footer from "./Footer";
import TopPerformars from "Containers/TopPerformars";
import Sidebar from "Components/Dashboard/Sidebar/Sidebar";
require("dotenv").config();
const Overview = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.OverView);
  const { CurentUserData } = state;
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <Sidebar />
      <div className="main-outer over-outer">
        <div className="main-contant">
          <div className="main-heading">
            <div className="title">
              <h1>Overview </h1>
            </div>
          </div>
          <div className="over-view-outer">
            <div className="box-heading">
              <div className="title">
                <h4>Welcome to Streambed!</h4>
                <p>All you need to know to get started.</p>
              </div>
            </div>
            <CenterComp />
            <Footer />
          </div>
        </div>
        {/* right-bar-fixed */}
        <div className={toggle ? "right-bar active" : "right-bar"}>
          <div className={toggle ? "mobile-btn change-btn" : "mobile-btn"}>
            {!toggle ? (
              <FontAwesomeIcon
                icon={faAngleLeft}
                className="toggle-btn bar-icon"
                onClick={() => setToggle(!toggle)}
              />
            ) : (
              <FontAwesomeIcon
                icon={faAngleRight}
                className="cross-icon"
                onClick={() => setToggle(!toggle)}
              />
            )}
          </div>
          <Profile />
          <TopPerformars />
          <div className="boder-bottom"></div>
          <CoprateUser />
        </div>
      </div>
    </>
  );
};
export default Overview;
