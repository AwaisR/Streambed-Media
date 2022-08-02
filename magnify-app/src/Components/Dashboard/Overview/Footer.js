import React from "react";
import magnify from "../../../assests/images/magnify.svg";
import anylatics from "../../../assests/images/anylatics.svg";
import { useHistory } from "react-router-dom";
export default function Footer() {
  let history = useHistory();
  return (
    <div>
      <div className="pages-link">
        <h5>Ready to just jump in?</h5>
        <div className="link-item">
          <div
            className="item"
            onClick={() => history.push("/dashboard/magnify")}
          >
            <div className="over-view-icon">
              <img src={magnify} />
            </div>
            <div className="over-view-box-content">
              <h3>Magnify</h3>
            </div>
          </div>
          <div
            className="item"
            onClick={() => history.push("/dashboard/analytics")}
          >
            <div className="over-view-icon">
              <img src={anylatics} />
            </div>
            <div className="over-view-box-content">
              <h3>Analytics</h3>
            </div>
          </div>
        </div>
        <p>Haven’t funded your wallet yet? Fund them here.</p>
      </div>
    </div>
  );
}
