import React from "react";
import "./MobileDevicePopup.css";
function MobileDevicePopup(props) {
  return (
    <div className="wrapper">
      <div className="mobile-wrap">
        <div className="mobile-logo">
          <button>
            <img
              alt="logo-green"
              src={require("../assets/images/Logo-Green.svg")}
            />
          </button>
        </div>
        <div className="mobile-content">
          <span>Well, aren’t you an eager beaver!</span>
          <div className="img-round">
            <img src={require("../assets/images/rabbit.png")} alt="img" />
          </div>
          <p>Our mobile site isn’t quite finished.</p>
          <p> Please click below to view our desktop version.</p>
          <button
            onClick={() => {
              props.goToDesktop();
            }}
            className="btn-version"
          >
            Desktop Version
          </button>
        </div>
        <div className="mobile-footer">
          <p>
            <a href="/#">Terms of Service </a>|<a href="/#">Privacy Policy</a>
          </p>
          <p>© All rights Reserved Streambed Media Inc 2020</p>
        </div>
      </div>
    </div>
  );
}

export default MobileDevicePopup;
