import react, { useState, useEffect } from "react";
import { Row, Navbar, Col, Nav, Tabs, Tab } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Overview from "Components/Dashboard/Overview/Overview";
import Analytics from "Components/Dashboard/Analytics";
import Setting from "Components/Dashboard/Settings";
import Wallet from "Components/Dashboard/Wallet";
import Campaigns from "Components/Dashboard/Campaigns";
import Magnify from "Components/Dashboard/Magnify";
import logo from "assests/images/logo.svg";
import signOut from "assests/images/signOut.svg";
import doller from "assests/images/doller.svg";
import overview from "assests/images/overview.svg";
import anylatics from "assests/images/anylatics.svg";
import compaigns from "assests/images/compaigns.svg";
import magnifay from "assests/images//magnify.svg";
import setting from "assests/images/setting.svg";
import { userLogin } from "store/login/action";
import { useSelector, useDispatch } from "react-redux";
import "./style.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useLocation,
} from "react-router-dom";
const Sidebar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.loginUser);
  const { userData, logout } = state;
  let location = useLocation();
  const [settings, setSettings] = useState(false);
  const [active, setActive] = useState(false);
  const [magnify, setMagnify] = useState(false);
  let MatchParams = location.pathname.split("/")[2];
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("Curentuser");
    dispatch(userLogin.logoutUser());
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/");
    }
  }, []);
  useEffect(() => {
    logout && history.push("/");
  }, [logout]);
  const handleSetting = () => {
    setSettings(!settings);
  };
  const handleMagnify = () => {
    setMagnify(true);
  };
  return (
    <div className="dashboard_wrap">
      <Tab.Container id="left-tabs-example" defaultActiveKey="overview">
        {/* Sidebar */}
        <div className="side_bar">
          <Nav variant="pills" className="flex-column">
            <Nav.Item className="mr-bottom">
              <Navbar.Brand href="#">
                <img src={logo} />
              </Navbar.Brand>
            </Nav.Item>
            <Nav.Item
              className={`${MatchParams === "overview" ? "active" : ""}`}
            >
              <Link to="/dashboard/overview">
                <img src={overview} />
                Overview
                {/* <Overview /> */}
              </Link>
            </Nav.Item>
            <Nav.Item
              className={`${MatchParams === "analytics" ? "active" : ""}`}
            >
              <Link to="/dashboard/analytics">
                <img src={anylatics} />
                Analytics
              </Link>
            </Nav.Item>
            <Nav.Item
              className={`${MatchParams === "campaigns" ? "active" : ""}`}
            >
              <Link
                disabled={true}
                // to="/dashboard/campaigns"
              >
                <img src={compaigns} />
                Campaigns
              </Link>
            </Nav.Item>
            <Nav.Item
              className={`${MatchParams === "magnify" ? "active" : ""}`}
            >
              <Link onClick={handleMagnify} to="/dashboard/magnify">
                <img src={magnifay} />
                Magnify
              </Link>
            </Nav.Item>
            <Nav.Item
              className={`${MatchParams === "wallets" ? "active" : ""}`}
            >
              <Link to="/dashboard/wallets">
                <img src={doller} />
                Wallets
              </Link>
            </Nav.Item>
            <Nav.Item
              className={`${MatchParams === "settings" ? "active" : ""}`}
            >
              <Link onClick={handleSetting} to="/dashboard/settings">
                <img src={setting} />
                Settings
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link onClick={() => handleLogout()}>
                <img src={signOut} />
                Sign-out
              </Link>
            </Nav.Item>
          </Nav>
        </div>
      </Tab.Container>
    </div>
  );
};
export default Sidebar;
