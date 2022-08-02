import React from "react";
import "./index.css";

import background from "../../assets/images/background.svg";
import { Link } from "react-router-dom";

function OnBoarding() {
  return (
    <div>
      <div className="wrapper-onboarding">
        <header>
          <img
            className="streambed--logo--main"
            src={require("../../assets/images/StreambedLogo.svg")}
            alt="streambed logo"
          />
        </header>
        <div className="bg--image">
          <img src={background} />
        </div>
        <div className="bg_image">
          <div className="form_wrap">
            <a href="" className="youtube">
              connect to youtube
            </a>

            <Link to="/">Go to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnBoarding;
