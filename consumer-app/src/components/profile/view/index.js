import React, { useEffect, useState } from "react";
import "./index.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Profile() {
  const [hasRT, setHasRT] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedAccounts, setLinkedAccounts] = useState();

  const token = window.localStorage.getItem("token");
  useEffect(() => {
    fetch("/users/getrT", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((accounts) => {
        const {
          rT,
          channelName,
          screen_name,
          zoomIsActive,
          linkedin,
        } = accounts;
        setHasRT(rT);
        setTwitter(screen_name);
        setLinkedAccounts(accounts);
      });
  }, []);

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
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  };
  useEffect(() => {
    getUser();
  }, []);

  const { name, email } = user;
  return (
    <div className="wrapper">
      <div className="content-wrap">
        <div className="profile-content">
          <div id="header-profile-tour" className="profile-info">
            <div className="profile-info-inner">
              <div className="avatar">
                <img
                  alt="avatar"
                  src={require("../../../assets/images/avatar.png")}
                />
              </div>
              <span className="main-text">{name}</span>
              <ul>
                <li>
                  <label>Email:</label>
                  <p>{email}</p>
                </li>
                <li>
                  <label>Password:</label>
                  <p>********</p>
                </li>
              </ul>
              <Link
                className="btn btn-outline-primary"
                id="edit-tab"
                to={`settings/edit`}
              >
                Edit profile
              </Link>
            </div>
          </div>
          <div className="linked-accounts">
            <span className="main-text">Linked Accounts</span>
            <ul>
              {hasRT ? (
                <li>
                  <button style={{ border: "none", background: "transparent" }}>
                    <img
                      alt="youtube icon"
                      src={require("../../../assets/images/youtube-icon.svg")}
                    />
                  </button>
                </li>
              ) : null}
              {twitter ? (
                <li>
                  <button style={{ border: "none", background: "transparent" }}>
                    <img
                      alt="youtube icon"
                      src={require("../../../assets/images/twitter-icon.svg")}
                    />
                  </button>
                </li>
              ) : null}
              {linkedAccounts?.facebook?.access_token ? (
                <li>
                  <button style={{ border: "none", background: "transparent" }}>
                    <img
                      alt="facebook icon"
                      src={require("../../../assets/images/icons/facebook-icon.svg")}
                    />
                  </button>
                </li>
              ) : null}
              {linkedAccounts?.instagram?.access_token ? (
                <li>
                  <button style={{ border: "none", background: "transparent" }}>
                    <img
                      alt="instagram icon"
                      src={require("../../../assets/images/instagram-icon.svg")}
                    />
                  </button>
                </li>
              ) : null}
              {linkedAccounts?.zoomIsActive ? (
                <li>
                  <button style={{ border: "none", background: "transparent" }}>
                    <img
                      alt="instagram icon"
                      src={require("../../../assets/images/icons/zoom.svg")}
                    />
                  </button>
                </li>
              ) : linkedAccounts?.linkedin?.access_token ? (
                <li>
                  <button style={{ border: "none", background: "transparent" }}>
                    <img
                      alt="instagram icon"
                      src={require("../../../assets/images/linkedin.svg")}
                    />
                  </button>
                </li>
              ) : null}
            </ul>
            <Link
              className="btn btn-outline-primary"
              id="edit-tab"
              to={`settings/link`}
            >
              EDIT LINKED ACCOUNTS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
