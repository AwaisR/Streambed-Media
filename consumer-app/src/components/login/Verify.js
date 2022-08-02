import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

function Verify() {
  let { email, expiryToken, expiryTime } = useParams();

  const history = useHistory();

  // if (
  //   typeof email === "undefined" ||
  //   typeof expiryToken === "undefined" ||
  //   typeof expiryTime === "undefined"
  // ) {
  //   // redirect if not having email, expirytoken or expiry time
  //   // history.push("/");
  // }

  const [message, setMessage] = useState("Thank you for verifying  ");
  const [activated, setActivated] = useState(true);

  useEffect(() => {
    async function activate() {
      const response = await fetch(
        `/users/account/active/${email}/${expiryToken}/${expiryTime}`
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
          await fetch(`/users/account/delete/${expiryToken}`, {
            method: "DELETE",
          });
          history.push("/signup");
        }
      }, 3000);

      return message;
    }
    activate();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="thanks-popup">
      <div className="thanks-content">
        <div className="logo">
          <a href="/#">
            <img
              src={require("../../assets/images/logo2.png")}
              alt="logoImage"
            />
          </a>
        </div>
        <p className="text-xs hover:text-gray-800">
          {message}
          <span>
            <i> {email} </i>
          </span>
          <span> -</span> !
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
