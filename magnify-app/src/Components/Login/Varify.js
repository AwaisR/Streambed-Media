import React, { useEffect, useState } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import logo from "../../assests/images/logo.svg";
import "../../Containers/index.css";
require("dotenv").config();
function Verify() {
  let { email, expiryToken, expiryTime } = useParams();
  var url = process.env.REACT_APP_URL;
  const history = useHistory();
  const [message, setMessage] = useState("Thank you for verifying  ");
  const [activated, setActivated] = useState(true);

  useEffect(() => {
    async function activate() {
      const response = await fetch(
        `${url}/users_mag/account/active/${email}/${expiryToken}/${expiryTime}`
      );

      const message = await response.json();

      const {
        message: { activated, content },
      } = message;

      setMessage(content);
      setTimeout(async () => {
        if (activated) {
          history.push("/");
        } else {
          setActivated(false);
          await fetch(`url/users/account/delete/${expiryToken}`, {
            method: "DELETE",
          });
          history.push("/signup");
        }
      }, 3000);
      return message;
    }
    activate();
  }, []);
  useEffect(() => {});
  return (
    <div className="thanks-popup">
      <div className="thanks-content">
        <div className="logo">
          <a href="#">
            <img src={logo} />
          </a>
        </div>
        <p>
          {message}
          <span>
            <i>{email}</i>
          </span>
          <span>-</span>!
        </p>

        <p>
          Now you will be redirected to{" "}
          {activated ? "login page" : "registration page"}
        </p>
      </div>
    </div>
  );
}

export default Verify;
