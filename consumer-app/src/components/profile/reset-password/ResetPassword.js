import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./index.css";
import queryString from "query-string";
import Input from "../../forms/Input";
import Button from "../../common/Button";
import { useLocation } from "react-router-dom";
function ForgotPwd() {
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  const [confirm, setConfirm] = useState(false);
  const { token, user, valid } = parsed;
  const history = useHistory();
  function ChangePwdForm() {
    const [error, setError] = useState("");
    const [passwordMatch, setPwdMatch] = useState(true);
    const [password, setPassword] = useState("");
    const [repassword, setRePassword] = useState("");

    const resetPassword = () => {
      if (password !== repassword) {
        setPwdMatch(false);
        return;
      } else {
        setPwdMatch(true);
      }

      const link = `users/account/reset-password`;
      const data = {
        email: user,
        token: token,
        password: password,
        valid: valid,
      };
      fetch(link, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          // if success show confirm msg to user
          setConfirm(data.success);
          if (data.success) {
            setTimeout(() => {
              history.push("/login");
              localStorage.removeItem("token");
            }, 5000);
          }
        });
    };
    return (
      <div className="forgot-pwd-wrapper">
        <div className="login-header"></div>
        <div className="pwd-inner-wrapper">
          <div>
            <div className="logo">
              <img
                src={require("../../../assets/images/Logo-Green.svg")}
                alt="logoImge1"
              />
            </div>
            <div className="forgot_title">Change password</div>

            <div className="forget-info">
              <p>You’re almost finished resetting your password!</p>
              <p>Please enter a new password below.</p>
            </div>

            <div className="form-group">
              <Input
                type="password"
                placeholder="Enter new password"
                className="form-control mb-3"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                className="form-control mb-3"
                onChange={(e) => {
                  setRePassword(e.target.value);
                  if (password !== e.target.value) {
                    setError("password does not match");
                    setPwdMatch(false);
                  } else {
                    setError("");
                    setPwdMatch(true);
                  }
                }}
              />
              <div
                className={`invalid-feedback ${
                  !passwordMatch ? "d-block" : ""
                }`}
              >
                {error}
              </div>
            </div>

            <Button
              onClick={() => {
                resetPassword();
              }}
              className="btn btn-primary"
            >
              Confirm Changes
            </Button>
          </div>
        </div>
      </div>
    );
  }
  function ChangepwdConfirm() {
    return (
      <div className="forgot-pwd-wrapper">
        <div className="login-header"></div>
        <div className="pwd-inner-wrapper">
          <div>
            <div className="logo">
              <img
                src={require("../../../assets/images/Logo-Green.svg")}
                alt="logoImge"
              />
            </div>
            <div className="confirm-info">
              <p>You have successfully changed your password.</p>
              <p>
                You will now be redirected to the{" "}
                <span className="">Login Page.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  function Invalid() {
    useEffect(() => {
      setTimeout(() => {
        history.push("/login");
      }, 3000);
    }, []);
    return (
      <div className="forgot-pwd-wrapper">
        <div className="login-header"></div>
        <div className="pwd-inner-wrapper">
          <div>
            <div className="logo">
              <img
                src={require("../../../assets/images/Logo-Green.svg")}
                alt="logoImges"
              />
            </div>
            <div className="confirm-info">
              <p>it seems the link is invalid, please try again later</p>
              <p>
                You will now be redirected to the{" "}
                <span className="">Login Page.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (valid === "false") {
    return <Invalid />;
  }
  return (
    <>
      {!confirm ? <ChangePwdForm /> : null}
      {confirm ? <ChangepwdConfirm /> : null}
    </>
  );
}

export default ForgotPwd;
