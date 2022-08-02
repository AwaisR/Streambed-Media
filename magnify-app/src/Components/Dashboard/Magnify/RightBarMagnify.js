import React, { useState, useEffect } from "react";
import "../Overview/overview.css";
import "./magnify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../assests/images/logo.svg";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, DropdownToggle, Row, Col } from "react-bootstrap";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import RightSideChart from "./RightSideChart";
import { magnifyActions } from "../../../store/magnify/action";
import Profile from "Containers/Profile";
import Addwallat from "../Wallet/Addwallat";
require("dotenv").config();
const RightBarMagnify = ({
  likeCount,
  priceSelect,
  paidPrice,
  youtubeVidoesPaid,
  companyVideosPaid,
}) => {
  let paidAmount = likeCount * priceSelect;
  let token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [walletBalance, seWalletBalance] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [perAmount, setPerAmount] = useState(0);
  const state = useSelector((state) => state.Magnify);
  const { CurentUserData, AllTransactions } = state;
  const handlePaidPrice = (e) => {
    e.preventDefault();
    if (paidAmount) {
      let data = {
        token: localStorage.getItem("token"),
        amount: paidAmount,
        type: "Magnify",
      };
      dispatch(magnifyActions.PaidVideoPrice(data));
      if (youtubeVidoesPaid.length) {
        dispatch(magnifyActions.paidYoutubeVideo(youtubeVidoesPaid, token));
      } else {
        dispatch(magnifyActions.paidCompanyVideo(companyVideosPaid, token));
      }
    }
  };
  useEffect(() => {
    let balance = 0;
    let amount = 0;
    let total = 0;
    if (AllTransactions)
      AllTransactions.map((item) => {
        amount = +amount + item.amount ? item.amount : "";
        total = +item.remaining;
        seWalletBalance(total);
      });
  }, [AllTransactions]);
  const hideAddWallet = (data) => {
    setShowWallet(false);
  };
  useEffect(() => {
    dispatch(magnifyActions.getTransaction(token));
  }, [showWallet]);
  useEffect(() => {
    let GraphAmount = (walletBalance / paidAmount) * 100;
    setPerAmount(GraphAmount);
  }, [walletBalance, paidAmount]);
  return (
    <>
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
        {showWallet ? (
          <Addwallat showWallet={showWallet} hideAddWallet={hideAddWallet} />
        ) : (
          <div className="mangnify-right-box">
            <div className="box-heading">
              <div className="title">
                <h4>Budget</h4>
              </div>
            </div>
            <div className="box-list">
              <div className="plus_icon" onClick={() => setShowWallet(true)}>
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  className="toggle-btn bar-icon "
                />
              </div>
              <RightSideChart
                paidAmount={paidAmount}
                walletBalance={walletBalance}
                perAmount={perAmount}
              />
            </div>

            <div className="box-description">
              <div className="description-item">
                <h5>Spending power</h5>
                <span>${walletBalance}</span>
              </div>
              <div className="description-item">
                <h5>Posts ready to be paid</h5>
                <div className="description-inner">
                  <span className="input-box">{likeCount}</span>
                  <span className="input-sign">x</span>
                  <span className="input-box">${priceSelect}</span>
                  <span className="input-sign">=</span>
                  <span className="input-box">${likeCount * priceSelect}</span>
                </div>
              </div>
              <div className="description-item">
                <h5>Balance remaining after payment</h5>
                <span>
                  $
                  {paidAmount
                    ? parseInt(walletBalance) - parseInt(paidAmount)
                    : walletBalance}
                </span>
              </div>
              <button
                className="form-btn sign-btn"
                onClick={handlePaidPrice}
                disabled={paidAmount ? false : true}
              >
                Pay All Selected Posts ${likeCount * priceSelect}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default RightBarMagnify;
