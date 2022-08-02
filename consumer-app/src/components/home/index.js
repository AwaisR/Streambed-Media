import React, { useState } from "react";
import "./index.css";
import background from "../../assets/images/background.svg";
import { Link, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const auth = useSelector((state) => state.auth);

  const { login } = auth;
  let token = localStorage.getItem("token");
  if (token) {
    return <Redirect to="/dashboard"></Redirect>;
  }

  return (
    <div>
      <div className="bg--image">
        <img src={background} />
      </div>
      <img
        className="streambed--logo--main"
        src={require("../../assets/images/StreambedLogo.svg")}
        alt="streambed logo"
      />
      <div className="container--login">
        <div className="login--box">
          <div className="trans--box">
            <div className="start-log--container">
              <div className="get-log--buttons">
                <Link className="main-screen--button link" to="/register">
                  Get Started
                </Link>
                <Link className="main-screen--button link" to="/login">
                  {" "}
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
