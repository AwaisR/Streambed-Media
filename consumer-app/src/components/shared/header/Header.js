import React, { useState, useEffect, useRef } from "react";
import { Link, useRouteMatch, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Header.css";
import axios from "axios";
import { addUser } from "../../../actions/index";
import { refreshDashBoard } from "../../../actions/dashboard";
import { socket } from "../../helpers/socket";
function Header() {
  const userData = useSelector((store) => store.user);

  const dispatch = useDispatch();

  const [onMenu, setOnMenu] = useState(true);
  const [clickedOutside, setClickedOutside] = useState(false);
  const header = useRef();
  const handleClickOutside = (e) => {
    if (!header.current.contains(e.target)) {
      setClickedOutside(true);
    }
  };
  const handleClickInside = () => {
    setClickedOutside(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  useEffect(() => {
    if (clickedOutside) {
      setOnMenu(true);
    }
  }, [clickedOutside]);

  const [user, setUser] = useState({ name: " ", email: " " });

  const getUser = () => {
    const token = window.localStorage.getItem("token");
    axios
      .get("/users/getuser", { headers: { Authorization: token } })
      .then(function (response) {
        const { user } = response.data;
        setUser({
          name: user.displayName,
          email: user.email,
        });
        socket.io.opts.query = {
          userId: user?._id,
        };

        socket.open();

        dispatch(addUser(user));
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  };
  useEffect(() => {
    getUser();
  }, []);
  let { path, url } = useRouteMatch();
  const [route, setRoute] = useState("");
  useEffect(() => {
    setRoute(url.replace("/", ""));
  }, [url]);

  return (
    <header ref={header} onClick={handleClickInside}>
      <div className="navbar-expand-md header-content navbar-light w-100 navbar-default">
        <div
          className="container mb-0"
          onClick={() => {
            if (!onMenu) {
              setOnMenu(true);
            }
          }}
        >
          <div className="row justify-content-between align-items-center">
            <div className="navbar-brand">
              <Link to="/home">
                <img
                  alt="logo"
                  className="logo"
                  src={require("../../../assets/images/icons/logo.svg")}
                />
              </Link>
            </div>
            <button
              className="navbar-toggler navToggle collapsed"
              type="button"
              data-toggle="collapse"
              aria-controls="desktopNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span onClick={() => openNav(true)}>
                <i className="fas fa-ellipsis-v text-white"></i>
              </span>
            </button>
            <div className="collapse navbar-collapse" id="desktopNav">
              <div className="header-right">
                <ul className="top-nav nav">
                  <li onClick={() => setOnMenu(true)}>
                    <Link
                      to="/video-upload"
                      className={`${route === "video-upload" ? "active" : ""}`}
                    >
                      <img
                        alt="upload"
                        src={require("../../../assets/images/upload.svg")}
                      />
                    </Link>
                  </li>
                  <li onClick={() => setOnMenu(true)}>
                    <Link
                      className={`${route === "dashboard" ? "active" : ""}`}
                      to="/dashboard"
                    >
                      <img
                        alt="dashboard"
                        style={{ height: "25px", width: "25px" }}
                        src={require("../../../assets/images/dashboard.svg")}
                      />
                    </Link>
                  </li>
                  <li onClick={() => setOnMenu(!onMenu)}>
                    <a className={`${route === "profile" ? "active" : ""}`}>
                      <img
                        alt="profile"
                        style={{ cursor: "pointer" }}
                        src={require("../../../assets/images/profile.svg")}
                      />
                    </a>
                  </li>
                  <li onClick={() => setOnMenu(true)}>
                    <Link
                      to="/settings/edit"
                      className={`${route === "settings" ? "active" : ""}`}
                    >
                      <img
                        alt="settings"
                        src={require("../../../assets/images/settings.svg")}
                      />
                    </Link>
                  </li>
                </ul>

                <div
                  className={`profile-dropdown ${
                    onMenu ? "hide-profile" : null
                  }`}
                >
                  <ul>
                    <li className="username" onClick={() => setOnMenu(true)}>
                      <div>
                        <div className="user-avatar">
                          <img
                            alt="avatar"
                            src={require("../../../assets/images/avatar.png")}
                          />
                        </div>
                        {userData.user ? (
                          <span>{userData.user.displayName}</span>
                        ) : null}
                      </div>
                    </li>
                    <li
                      className="view-profile"
                      onClick={() => setOnMenu(!onMenu)}
                    >
                      <Link
                        to="/profile"
                        className={`${route === "profile" ? "active" : ""}`}
                      >
                        View Profile
                      </Link>
                    </li>
                    <li onClick={() => setOnMenu(true)}>
                      <Link
                        to="/video-upload"
                        className={`${
                          route === "video-upload" ? "active" : ""
                        }`}
                      >
                        upload video
                      </Link>
                    </li>
                    <li onClick={() => setOnMenu(true)}>
                      <Link
                        className={`${route === "dashboard" ? "active" : ""}`}
                        to="/dashboard"
                      >
                        dashboard
                      </Link>
                    </li>
                    <li onClick={() => setOnMenu(true)}>
                      <Link
                        to="/settings/edit"
                        className={`${route === "settings" ? "active" : ""}`}
                      >
                        settings
                      </Link>
                    </li>
                    <li className="sign-out" onClick={() => setOnMenu(true)}>
                      <Link to="/logout">Sign out</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar fixed-bottom navbar-light bg-light d-md-none bottomNav">
        <ul className="d-flex flex-row">
          <li>
            <div className="d-flex flex-col align-items-center">
              <NavLink
                to="/settings"
                activeClassName="selectedNav"
                id="settingsBottom"
                className={`${route === "settings" ? "active" : ""}`}
              >
                <p>Settings</p>
              </NavLink>
            </div>
          </li>

          <li>
            <div className="d-flex flex-col align-items-center">
              <NavLink
                to="/profile"
                activeClassName="selectedNav"
                id="profileBottom"
                className={`${route === "profile" ? "active" : ""}`}
              >
                <p>Profile</p>
              </NavLink>
            </div>
          </li>

          <li>
            <div
              className="d-flex flex-col align-items-center"
              id="uploadBottom"
            >
              <NavLink
                to="/video-upload"
                activeClassName="selectedNav"
                className={`${route === "video-upload" ? "active" : ""}`}
              >
                <img
                  alt="upload-icon"
                  className="uploadIcon"
                  src={require("../../../assets/images/uploadMobile.svg")}
                />
                <p>Upload</p>
              </NavLink>
            </div>
          </li>

          <li>
            <div className="d-flex flex-col align-items-center">
              <NavLink
                className={`${route === "dashboard" ? "active" : ""}`}
                to="/dashboard"
                activeClassName="selectedNav"
                id="dashboardBottom"
              >
                <p>
                  <span>Dashboard</span>
                </p>
              </NavLink>
            </div>
          </li>

          <li
            onClick={() => {
              setOnMenu(true);
              dispatch(refreshDashBoard(false));
            }}
          >
            <div className="d-flex flex-col align-items-center">
              <div
                className="selectedNav"
                id="refreshBottom"
                className={`${route === "profile" ? "active" : ""}`}
              >
                <p>Refresh</p>
              </div>
            </div>
          </li>
        </ul>
      </nav>

      <div
        id="mySidenav"
        className="sidenav pt-3"
        onTouchEnd={() => closeNav(true)}
      >
        <div className="pr-4 pb-3">
          <li className="username" onClick={() => setOnMenu(true)}>
            {userData.user ? <span>{userData.user.displayName}</span> : null}
          </li>
          <ul>
            <li className="sign-out" onClick={() => setOnMenu(true)}>
              <Link className="btn btn-primary btn-sidenav" to="/logout">
                Sign out
              </Link>
            </li>
          </ul>
        </div>
        <div className="bgWhite pt-3 pr-4">
          <a
            // href="javascript:void(0)"
            className="closebtn pt-3"
            onClick={() => closeNav(true)}
          >
            <i className="fas fa-chevron-right"></i>
          </a>
          <NavLink to="/dashboard" activeClassName="selectedNav">
            Dashboard
          </NavLink>
          <NavLink to="/video-upload" activeClassName="selectedNav">
            Upload
          </NavLink>
          <NavLink to="/profile" activeClassName="selectedNav">
            Profile
          </NavLink>
          <NavLink to="/settings" activeClassName="selectedNav">
            Settings
          </NavLink>
        </div>
        <div className="pr-4 pl-4 pt-3 text-white">
          <div className="pb-2">
            <img
              alt="side nav logo"
              className="sidenavLogo"
              src={require("../../../assets/images/icons/logo.svg")}
            />
          </div>
          <div>
            <ul className="list-inline mb-0 socials mt-2">
              <li className="list-inline-item">
                <a
                  href="https://www.linkedin.com/company/streambed-media/about/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-linkedin-square fa fa-fw streamFab"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.facebook.com/thestreambed" target="_blank">
                  <i className="fab fa-facebook-square fa fa-fw streamFab"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="http://twitter.com/streambedmedia"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <i className="fab fa-twitter-square fa fa-fw streamFab"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="http://www.instagram.com/streambedmedia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-instagram fa fa streamFab"></i>
                </a>
              </li>
            </ul>
          </div>

          <div className="footerSideNav mt-2 mb-2">
            <a
              href="https://streambedmedia.com/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service&nbsp;
            </a>
            <a
              href="https://streambedmedia.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </div>
          <div className="copywriteSideNav">
            &copy; All rights Reserved Streambed Media Inc &nbsp;
            {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </header>
    //   {/* <!-- Header End --> */}
  );
}

function openNav() {
  try {
    document.getElementById("mySidenav").style.width = "250px";
  } catch (error) {}
}

function closeNav() {
  try {
    document.getElementById("mySidenav").style.width = "0";
  } catch (error) {}
}

document.addEventListener("click", closeNav);

export default Header;
