import React from "react";
import Pencil from "../../../assests/images/pencil.svg";
import Trade from "../../../assests/images/trade.svg";
import Dollar from "../../../assests/images/dollar.svg";
export default function CenterComp() {
  return (
    <div>
      <div className="over-view-item">
        <div className="over-view-box">
          <div className="over-view-icon">
            <img src={Pencil} />
          </div>
          <div className="over-view-box-content">
            <h3>Connect your Stripe Account</h3>
            <p>
              Check out all the people that are posting about your brand and
              compensate them directly for their analytics
            </p>
          </div>
        </div>
        <div className="over-view-box">
          <div className="over-view-icon">
            <img src={Dollar} />
          </div>
          <div className="over-view-box-content">
            <h3> Browse Content</h3>
            <p>
              Top up your account to get access to direct, publisher-level
              analytics
            </p>
          </div>
        </div>
        <div className="over-view-box">
          <div className="over-view-icon">
            <img src={Trade} />
          </div>
          <div className="over-view-box-content">
            <h3> See Combined Analytics</h3>
            <p>
              Check out the aggregate patterns of all your compensated creators
              to map traffic
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
