import React, { useState, useEffect } from "react";
import "./wallet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import logo from "../../../assests/images/logo.svg";
import { Dropdown, DropdownToggle, Row, Col } from "react-bootstrap";
import Profile from "Containers/Profile";
import Transetion from "./Transetion";
import Sidebar from "Components/Dashboard/Sidebar/Sidebar";
import { walletsAction } from "../../../store/wallet/action";
import { useSelector, useDispatch } from "react-redux";
import Addwallat from "./Addwallat";
require("dotenv").config();
const Wallet = () => {
  var url = process.env.REACT_APP_URL;
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const state = useSelector((state) => state.Wallet);
  const { AllTransactions, Balance } = state;
  const [showTransection, setShowTransection] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [currentBalance, setCurentBalnce] = useState(0);
  useEffect(() => {
    dispatch(walletsAction.getTransaction(token));
  }, []);

  useEffect(() => {
    let balance = 0;
    let amount = 0;
    let total = 0;
    if (AllTransactions)
      AllTransactions.map((item) => {
        amount = +amount + item.amount ? item.amount : "";
        total = +item.remaining;
        setCurentBalnce(total);
      });
  }, [AllTransactions]);
  return (
    <>
      <Sidebar />
      <div className="main-outer wallet">
        {/* main-contant */}
        <div className="main-contant">
          {/*main-heading */}
          <div className="main-heading">
            <div className="title">
              <h1>Wallets </h1>
            </div>
          </div>
          <div className="wallet-box-outer">
            <div className="box-heading">
              <h3>Current Wallet</h3>
            </div>
            <div className="profile-info-outer">
              <div className="profile-item">
                <div className="item-data">
                  <div className="dollar-icon">
                    <FontAwesomeIcon icon={faDollarSign} />
                  </div>
                </div>
                <div className="item-data">
                  <h3>Wallet Balance</h3>
                  <p className="purple-clr">${currentBalance}</p>
                </div>
                <div className="item-data-button">
                  <button
                    value="Input"
                    type="button"
                    className={`${
                      !showTransection ? "wallet-btn" : "wallet-btn active"
                    }`}
                    onClick={() => setShowTransection(!showTransection)}
                  >
                    {!showTransection
                      ? "View transactions"
                      : "Hide transactions"}
                  </button>
                </div>
              </div>
            </div>
            {showTransection && (
              <Transetion AllTransactions={AllTransactions} />
            )}
          </div>
        </div>

        {/* right-bar-fixed */}
        <div
          className={
            toggle
              ? "right-bar wallet-right-bar active"
              : "right-bar wallet-right-bar"
          }
        >
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
          <Addwallat />
        </div>
      </div>
    </>
  );
};
export default Wallet;
