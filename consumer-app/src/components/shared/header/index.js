import React, { useState } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import swal from "@sweetalert/with-react";
import Hamburger from "../../UserForms/Hamburger";
import ResetPassword from "../../UserForms/ResetPassword";
import BackupWallet from "../../UserForms/BackupWallet";
import StreambedLogo from "../../../assets/images/StreambedLogo.svg";

function Header(props) {
  const resetPassword = () => {};

  const [showMenu, setShowMenu] = useState(true);
  const menuClass = classNames("nav-menu", showMenu ? "display-none" : "");
  return (
    <header>
      <div className="container">
        <div className="header-row">
          <div className="logo">
            <a href="#">
              <img src={StreambedLogo} />
            </a>
          </div>
          <div
            onClick={() => {
              setShowMenu(!showMenu);
            }}
            className="menu-btn"
          >
            <i className="fa fa-bars" aria-hidden="true"></i>
          </div>
        </div>
      </div>
      <div className={menuClass}>
        <ul>
          <li
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          >
            <Link to="/video-upload">Publisher</Link>
          </li>
          <li
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          >
            <BackupWallet handleClose={setShowMenu} />
          </li>
          <li
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          >
            <ResetPassword handleClose={setShowMenu} />
          </li>
          <li
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          >
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
