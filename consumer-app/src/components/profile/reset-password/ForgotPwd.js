import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Input from "../../../components/forms/Input";
import Button from "../../common/Button";
import "./index.css";

function ForgotPwd() {
  const [confirm, setConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const history = useHistory();
  const [validEmail, setValidEmail] = useState(true);
  /* eslint-disable  */
  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

  const isValidEmail = () => {
    const isValidEmail = validEmailRegex.test(email.trim());

    if (!isValidEmail) {
      setValidEmail(false);
    } else {
      setValidEmail(true);
    }
  };
  const resetEmail = () => {
    isValidEmail();
    fetch("/users/forgot-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
      .then((res) => res.json())
      .then((data) => {
        // if success show confirm msg to user
        setConfirm(data.success);

        if (data.success) {
          setTimeout(() => {
            history.push("/login");
          }, 5000);
        }
        // else show msg to user record not found
      });
  };
  function Confirmation() {
    return (
      <div className="forgot-pwd-wrapper">
        <div className="login-header"></div>
        <div className="pwd-inner-wrapper">
          <div>
            <div className="logo">
              <img src={require("../../../assets/images/Logo-Green.svg")} />
            </div>
            <div className="confirm_title">You go glen coco!</div>.
            <div className="confirm-info">
              <p>
                If this account exists, we’ve sent an email to the primary
                address associated with it
              </p>
              <p>Please check your inbox for further instructions.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {!confirm ? (
        <div className="forgot-pwd-wrapper">
          <div className="login-header"></div>
          <div className="pwd-inner-wrapper">
            <div>
              <div className="logo">
                <img src={require("../../../assets/images/Logo-Green.svg")} />
              </div>
              <div className="forgot_title">Forgot your password?</div>

              <div className="forget-info">
                <p>
                  Don’t worry, we’ll email you a link to reset your password.
                </p>
                <p>
                  Just enter the email or username associated with your account
                  and we will send you a link and further instructions.
                </p>
              </div>

              <div className="form-group">
                <Input
                  type="email"
                  placeholder="Username or email"
                  name="email"
                  className="form-control"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    isValidEmail();
                  }}
                />
                {!validEmail ? <div className="">email not valid</div> : null}
              </div>
              <Button
                onClick={() => {
                  resetEmail();
                }}
                className="btn btn-primary"
              >
                Send reset Link
              </Button>

              <div className="log-footer">
                <div className="forgot-group">
                  <label>Remembered your password?</label>
                </div>
                <Link className="ml-1" to="/login">
                  <Button theme="active" className="w-44">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="reset-footer">
            <div className="row no-gutters">
              <div className="col-sm-6 text-center">
                © All rights Reserved Streambed Media Inc 2020
              </div>
              <div className="col-sm-6 text-center">
                <Link to="https://streambedmedia.com/terms">
                  Terms of Service&nbsp;
                </Link>
                |&nbsp;
                <Link to="https://streambedmedia.com/privacy">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {confirm ? <Confirmation /> : null}
    </>
  );
}

export default ForgotPwd;
