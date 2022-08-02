import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import { Link } from "react-router-dom";
import Alert from "../shared/Alert";
import "./createUserForm.css";

const CreateUserForm = () => {
  var location = useHistory();
  /**************************STATE SECTION************************/
  //**Display Name States */
  const [username, setUsername] = useState("");
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");

  //**Password States */
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passErrorMessage, setPassErrorMessage] = useState("");

  //**Email States */
  const [email, setEmail] = useState("");
  const [reEmail, setReEmail] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  // Terms and condition message display
  const [termsMessage, setTermsMessage] = useState("");

  const [reg_success, setRegSuccess] = useState(false);
  const [agree_terms, setAgreeTerms] = useState(false);

  const validateForm = (e) => {
    if (email !== reEmail) {
      setEmailErrorMessage("Emails do not match!");
      setUsernameErrorMessage("");
    } else if (password !== rePassword) {
      setEmailErrorMessage("");
      setPassErrorMessage("Passwords do not match!");
    } else if (!agree_terms) {
      setTermsMessage("You must agree to Terms & Condition first");
    } else {
      setPassErrorMessage("");
      sendUser();
    }
  };

  const sendUser = () => {
    fetch("/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        displayName: username,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((message) => {
        if (message.error) {
          setUsernameErrorMessage(message.error);
        }
        if (message.success) {
          setUsernameErrorMessage("");
          setRegSuccess(true);
          setTimeout(() => {
            setRegSuccess(false);
            location.push("/");
          }, 4000);
        }
      });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    validateForm(e);
  };

  /*************The placeholders are fontawesome unicode, allows them to show in the placeholder field *****************/
  /*************Password fields get set to state to compare before submit*/
  return (
    <div>
      {/*  */}

      <div className="wrapper">
        <div className="login-header d-flex flex-col">
          <div className="logo d-flex justify-content-center">
            <img
              alt="logo"
              className="align-self-center"
              src={require("../../assets/images/logo.svg")}
            />
          </div>
        </div>
        <div className="signup-wrap">
          <div className="log-container">
            <div className="row align-items-center">
              <div className="col-12">
                <div className="logForm">
                  <div class="d-flex justify-content-center">
                    <img
                      alt="logo"
                      className="headerLargeSignUp"
                      src={require("../../assets/images/Logo-Green.svg")}
                    />
                  </div>
                  <p class="tagline">
                    Unlock a world of collaborative creativity.
                  </p>

                  <form onSubmit={onFormSubmit}>
                    <div className="form-group">
                      <input
                        required
                        placeholder="Username"
                        className="form-control"
                        onChange={(e) => {
                          setUsername(e.target.value.trim());
                        }}
                      />
                    </div>
                    <div>
                      {usernameErrorMessage.length > 0 ? (
                        <Alert
                          content={usernameErrorMessage}
                          setAlert={() => {
                            setUsernameErrorMessage("");
                          }}
                        />
                      ) : null}
                    </div>
                    <div className="form-group">
                      <input
                        required
                        placeholder="Email"
                        className="form-control"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        required
                        placeholder="Confirm Email"
                        className="form-control"
                        onChange={(e) => {
                          setReEmail(e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      {emailErrorMessage.length > 0 ? (
                        <Alert
                          content={emailErrorMessage}
                          setAlert={() => {
                            setEmailErrorMessage("");
                          }}
                        />
                      ) : null}
                    </div>
                    <div className="form-group">
                      <input
                        required
                        type="password"
                        placeholder="Password"
                        className="form-control"
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        required
                        type="password"
                        placeholder="Confirm Password"
                        className="form-control"
                        onChange={(e) => {
                          setRePassword(e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      {passErrorMessage.length > 0 ? (
                        <Alert
                          content={passErrorMessage}
                          setAlert={() => {
                            setPassErrorMessage("");
                          }}
                        />
                      ) : null}
                    </div>
                    <div className="form-group form-check formCheck-terms">
                      <div>
                        {termsMessage.length > 0 ? (
                          <Alert
                            content={termsMessage}
                            setAlert={() => {
                              // setAgreeTerms(!agree_terms);
                              setTermsMessage("");
                            }}
                          />
                        ) : null}
                      </div>
                      <input
                        type="checkbox"
                        id="html2"
                        value={agree_terms}
                        checked={agree_terms}
                        onChange={() => {
                          setAgreeTerms(!agree_terms);
                          setTermsMessage("");
                        }}
                      />

                      <label htmlFor="html2">
                        I agree to Streambed Media’s
                        <a href="https://streambedmedia.com/terms">
                          {" "}
                          Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a href="https://streambedmedia.com/privacy">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    <button className="btn btn-primary">Sign Up</button>
                  </form>
                  <div className="log-footer">
                    <div className="forgot-group">
                      <label>Already have an account?</label>
                      <Link to="/login" className="btn btn-secondary">
                        SIGN IN
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {reg_success ? (
          <div className="thanks-popup">
            <div className="thanks-content">
              <div className="logo">
                <a href="#">
                  <img
                    alt="logo"
                    src={require("../../assets/images/Logo-Green.svg")}
                  />
                </a>
              </div>
              <div className="thank-you-msg">
                <p>
                  Thank you for registering <span> {username}</span>!
                  <br />
                  An email has been sent to <br />
                  <span>{email}</span>
                </p>
                <p>Please verify your email address to continue.</p>
                <p>
                  You will now be redirected to the
                  <a href="#"> Login Page</a>
                </p>
              </div>
            </div>
          </div>
        ) : null}
        <footer className="login-footer flex-wrap">
          <div>
            &copy; All rights Reserved Streambed Media Inc &nbsp;
            {new Date().getFullYear()}
          </div>
          <div className="order-first order-sm-2">
            <Link to="https://streambedmedia.com/terms">
              Terms of Service&nbsp;
            </Link>
            |&nbsp;
            <Link to="https://streambedmedia.com/privacy">Privacy Policy</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CreateUserForm;
