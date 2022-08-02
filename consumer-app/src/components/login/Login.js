import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Alert from "../shared/Alert";

import { socket } from "../helpers/socket";
const Login = () => {
  let history = useHistory();
  const dispatch = useDispatch();

  //State for login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  let token = localStorage.getItem("token");
  if (token == "null" || token == null || token == "undefined" || !token) {
    // history.push("/");
    // return;
  }
  if (token) {
    history.push("/home");
  }

  // check if the user is verified
  const [verifed, setVerified] = useState(false);

  //Login and send back mnemonic, decrpyt it and set to local storage
  //Local storage is used with publishing videos
  const onLogin = async () => {
    try {
      const response = await fetch("users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        setError(data.msg);
        window.localStorage.removeItem("token");
        if (data.activated === false) {
          // setVerified(true);
        }
        return;
      } else {
        window.localStorage.setItem("token", JSON.stringify(data.token));
        dispatch({ type: "LOGIN", payload: true });
        socket.emit("login");
        history.push("/home");
      }

      const { mnemonic } = data;

      // handle error response
      const createWalletData = await fetch("users/createWallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mnemonic: mnemonic,
          password,
        }),
      });

      const wifJson = await createWalletData.json();
      localStorage.setItem("userAddress", JSON.stringify(wifJson.wif));
    } catch {
      console.log("onLogin error");
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };
  const setAlert = () => {
    setVerified(false);
  };

  return (
    <div className="wrapper-login">
      {/* <header /> */}
      <div className="login-header"></div>
      <div className="login-wrap">
        <div className="log-container">
          <div className="row">
            <div className="col-12">
              <div className="logForm">
                <div className="logo">
                  <img
                    alt="logo green"
                    src={require("../../assets/images/Logo-Green.svg")}
                  />
                </div>
                <form onSubmit={onFormSubmit}>
                  <div className="form-group loginFormSpacing">
                    <input
                      placeholder="Username"
                      className="form-control"
                      onChange={(e) => {
                        setEmail(e.target.value.trim());
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      placeholder="Password"
                      className="form-control"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-group form-check rememberMeSection">
                    <input type="checkbox" id="html1" />
                    <label htmlFor="html1">Remember me</label>
                  </div>
                  <div className="login-alert">
                    {error.length > 0 ? (
                      <Alert
                        content={error}
                        setAlert={() => {
                          setError("");
                        }}
                      />
                    ) : null}
                  </div>
                  <button className="btn btn-primary">Sign in</button>
                </form>
                <div className="forget-password-link">
                  <Link className="" to="/forget-password">
                    Forgot password?
                  </Link>
                </div>
                <div className="log-footer">
                  <div className="forgot-group">
                    <label>Don’t have an account?</label>
                    <Link className="btn btn-secondary" to="/signup">
                      SIGN Up
                    </Link>
                  </div>

                  <div className="forgot-group mt-3">
                    <label>Want to recover a deleted account?</label>
                    <Link className="btn btn-secondary" to="/forget-password">
                      Recover account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- LogIn Popup --> */}
      {verifed ? (
        <div className="login-alert">
          <Alert
            show={verifed}
            content=" It looks like you haven’t verified your email address yet, please check
        your inbox."
            setAlert={setAlert}
          />
        </div>
      ) : null}
      <div className="reset-footer">
        <div className="row no-gutters">
          <div className="col-sm-6 text-center">
            © All rights Reserved Streambed Media Inc
            {new Date().getFullYear()}
          </div>
          <div className="col-sm-6 text-center">
            <Link to="https://streambedmedia.com/terms">
              Terms of Service&nbsp;
            </Link>
            |&nbsp;
            <Link to="https://streambedmedia.com/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
