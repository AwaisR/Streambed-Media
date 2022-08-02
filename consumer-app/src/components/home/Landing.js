import React, { useState, useEffect } from "react";
import "./Landing.css";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../actions/index";
function Landing() {
  // const [user, setUser] = useState({ name: " ", email: " " });
  const dispatch = useDispatch();
  const _user = useSelector((state) => state.user.user);
  const getUser = () => {
    const token = window.localStorage.getItem("token");
    axios
      .get("/users/getuser", { headers: { Authorization: token } })
      .then(function (response) {
        const { user } = response.data;

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
  const history = useHistory();

  return (
    <div className="welcome_wrap">
      <div className="container">
        <div className="welcome_title text-center">
          <span>Hello {_user?.displayName},</span>
          <h2>Welcome to Streambed!</h2>
          <span>All you need to know to get started.</span>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="welcome_card text-center">
              <div className="wel_icon">
                <img src={require("../../assets/images/landing/index.png")} />
              </div>
              <h4 className="color_green card-title">The Stream Pages</h4>
              <p>
                Timestamp it, own it, it’s yours! Every post you make gets
                catalogued for all the public to see!
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="welcome_card text-center">
              <div className="wel_icon">
                <img src={require("../../assets/images/landing/tag.png")} />
              </div>
              <h4 className="color_primary card-title">Tagging Your Buds</h4>
              <p>
                Publishing takes minions sometimes. We let you tag them so they
                will forever get the credit of helping you out!
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="welcome_card text-center">
              <div className="wel_icon">
                <img
                  src={require("../../assets/images/landing/analytics.png")}
                />
              </div>
              <h4 className="color_secondary card-title">
                We’ve got your analytics!
              </h4>
              <p>
                Tracking data of all your posts is what we’re made for! Get all
                those numbers to prove your social media footprint.
              </p>
            </div>
          </div>
        </div>
        <hr />

        <div className="welcome_title text-center">
          <span>Ready to just jump in?</span>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div
              onClick={() => {
                history.push("video-upload");
              }}
              className="welcome_card text-center card_sm"
            >
              <div className="wel_icon">
                <img src={require("../../assets/images/landing/upload.png")} />
              </div>
              <span>Upload</span>
            </div>
          </div>
          <div className="col-md-4">
            <div
              onClick={() => {
                history.push("dashboard");
              }}
              className="welcome_card text-center card_sm"
            >
              <div className="wel_icon">
                <img
                  src={require("../../assets/images/landing/dashboard.png")}
                />
              </div>
              <span>Dashboard</span>
            </div>
          </div>
        </div>
        <p className="p_bottom">
          Haven’t linked your accounts yet?
          <br />
          <a href="/settings/link"> Link them here.</a>
        </p>
      </div>
    </div>
  );
}

export default Landing;
