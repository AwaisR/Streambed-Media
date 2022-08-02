import react, { useState, useEffect } from "react";
import logo from "../assests/images/logo.svg";
import "./index.css";
import Button from "./Button";
import Footer from "./Footer";
import Logo from "./Logo";
import InputFeild from "./InputFeild";
import { useHistory } from "react-router-dom";
import ErrorPopUp from "./ErrorPopUp";
const LeftSideBar = () => {
  const history = useHistory();
  const [show, setShow] = useState("");
  const handleSignUp = () => {
    history.push("/signup");
  };
  const handleSignIn = () => {
    setShow("Invalid username and password");
  };
  const handleCencel = () => {
    setShow("");
  };
  return (
    <>
      <div>
        <div className="row no-gutters">
          <Logo />
          <div className="col-8">
            <div className="content-wrap">
              <div className="container">
                <div className="content-inner">
                  <h1>Welcome to Streambed Magnify</h1>
                  <InputFeild
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    type="email"
                  />
                  <InputFeild
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    type="password"
                  />
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      className="form-check-input input-box"
                      id="exampleCheck1"
                    />
                    <label className="form-check-label" for="exampleCheck1">
                      Remember me
                    </label>
                  </div>
                  <Button
                    name="Sign in"
                    className="form-btn sign-btn"
                    handleClick={handleSignIn}
                  />
                  {show && (
                    <ErrorPopUp message={show} handleCencel={handleCencel} />
                  )}
                  <a
                    className="forgot"
                    onClick={() => history.push("/forget-password")}
                  >
                    Forgot password?
                  </a>
                </div>

                <div className="sign-up">
                  <span className="main-title">Don’t have an account?</span>
                  <Button
                    name="Sign up"
                    className="form-btn"
                    handleClick={handleSignUp}
                  />
                </div>
                <div className="sign-up">
                  <span className="main-title">What is Streambed Magnify?</span>
                  <Button name="Learn More" className="form-btn" />
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};
export default LeftSideBar;
