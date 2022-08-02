import React from "react";
import { Tabs, Tab, Button } from "react-bootstrap";
import "./campaigns.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const Campaigns = () => {
  return (
    <>
      <div className="campaigns main-outer">
        {/* main-contant */}
        <div className="main-contant">
          {/* main-heading  */}
          <div className="main-heading">
            <div className="title">
              <h1>Campaigns</h1>
            </div>
            <div className="main-icon">
              <a href="#" className="graph-btn">
                <FontAwesomeIcon icon={faPlusCircle} />
                <span className="create-text">Create Campaign</span>
              </a>
            </div>
          </div>
          {/* graph-box */}
          <div className="graph-box">
            <div className="box-heading">
              <div className="campaigns-tabs">
                <Tabs
                  defaultActiveKey="home"
                  transition={false}
                  id="noanim-tab-example"
                >
                  <Tab eventKey="All" title="All"></Tab>
                  <Tab eventKey="Active" title="Active"></Tab>
                  <Tab eventKey="Expired" title="Expired"></Tab>
                  <Tab eventKey="Upcoming" title="Upcoming" disabled></Tab>
                  <Tab eventKey="contact" title="Drafts" disabled></Tab>
                </Tabs>
              </div>
            </div>
            <div className="content-box row no-gutters">
              <div className="col-9">
                <div className="contant-title">
                  <div className="camp-logo">
                    <div className="camp-icon">
                      <img src="/static/media/logo.e25dcf3c.svg" />
                    </div>
                    <div className="camp-title">
                      <h2>Yogis Unite</h2>
                      <span>LuLuLemon Athletica</span>
                    </div>
                  </div>
                  <div className="camp-right">
                    <FontAwesomeIcon icon={faEdit} />
                    <span>16 days left</span>
                  </div>
                </div>
                <div className="content-details">
                  <span className="camp-title">Dates active</span>
                  <p>November 12, 2020 – December 17, 2020</p>
                </div>
                <div className="content-details">
                  <span className="camp-title">Criteria</span>
                  <p>
                    <span>Coming soon! </span>
                    Use filters in the magnifier to streamline the content your
                    company has been tagged in.
                  </p>
                </div>
                <div className="content-details">
                  <span className="camp-title">Campaign Search Tags</span>
                  <ul className="hashtag">
                    <li>
                      <a src="#">#YogisUnite</a>
                    </li>
                    <li>
                      <a src="#">#YogisUnite</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-3 budget-side ">
                <div className="budget-box">
                  <a>
                    <FontAwesomeIcon icon={faPlusCircle} />
                  </a>
                </div>
                <Button type="button" value="Input" className="budget-btn">
                  Analytics
                </Button>
                <Button type="button" value="Input" className="budget-btn">
                  Add Funds
                </Button>
                <Button
                  type="button"
                  value="Input"
                  className="budget-btn magnify"
                >
                  Magnify
                </Button>
              </div>
            </div>
            {/* box-2 */}
            <div className="content-box row no-gutters">
              <div className="col-9">
                <div className="contant-title">
                  <div className="camp-logo">
                    <div className="camp-icon">
                      <img src="/static/media/logo.e25dcf3c.svg" />
                    </div>
                    <div className="camp-title">
                      <h2>Yogis Unite</h2>
                      <span>LuLuLemon Athletica</span>
                    </div>
                  </div>
                  <div className="camp-right">
                    <FontAwesomeIcon icon={faEdit} />
                    <span>16 days left</span>
                  </div>
                </div>
                <div className="content-details">
                  <span className="camp-title">Dates active</span>
                  <p>November 12, 2020 – December 17, 2020</p>
                </div>
                <div className="content-details">
                  <span className="camp-title">Criteria</span>
                  <p>
                    <span>Coming soon! </span>
                    Use filters in the magnifier to streamline the content your
                    company has been tagged in.
                  </p>
                </div>
                <div className="content-details">
                  <span className="camp-title">Campaign Search Tags</span>
                  <ul className="hashtag">
                    <li>
                      <a src="#">#NoDaysOff</a>
                    </li>
                    <li>
                      <a src="#">#NDO</a>
                    </li>
                    <li>
                      <a src="#">#NDOLuLu</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-3 budget-side ">
                <div className="budget-box">
                  <a>
                    <FontAwesomeIcon icon={faPlusCircle} />
                  </a>
                </div>
                <Button type="button" value="Input" className="budget-btn">
                  Analytics
                </Button>
                <Button type="button" value="Input" className="budget-btn">
                  Add Funds
                </Button>
                <Button
                  type="button"
                  value="Input"
                  className="budget-btn magnify"
                >
                  Magnify
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* right-bar-fixed */}
        <div className="camp-manager right-bar">
          {/* profile */}
          <div className="profile">
            <div className="camp-icon profile-img">
              <img src="/static/media/logo.e25dcf3c.svg" />
            </div>
            <div className="profile-info">
              <h3>LuLuLemon Athletica</h3>
              <p>Current User: Ezra Bridger</p>
            </div>
          </div>
          {/* graph-box */}
          <div className="graph-box">
            <div className="box-heading">
              <div className="title">
                <h4>Campaign Reach</h4>
                <p>Campaign budget usage</p>
              </div>
              <div className="box-selector">
                <a href="">
                  <FontAwesomeIcon icon={faEye} />
                </a>
              </div>
            </div>
            {/* graph-box-list */}
            <div className="graph-box-list">
              <div className="graph-box-item">
                <div className="list-info purple-clr">
                  <h5>Yoga Unite</h5>
                  <p>16 days left</p>
                </div>
                <div className="list-price purple-clr">
                  <h5>90% complete </h5>
                  <p>$4,805 of $5,000</p>
                </div>
              </div>
              <div className="graph-box-item">
                <div className="list-info purple-clr">
                  <h5>No Days Off</h5>
                  <p>28 days left</p>
                </div>
                <div className="list-price purple-clr">
                  <h5>52% complete</h5>
                  <p>$31,894 of $60,000</p>
                </div>
              </div>
              <div className="graph-box-item">
                <div className="list-info purple-clr">
                  <h5>WFA: Work From…</h5>
                  <p>2 days until start</p>
                </div>
                <div className="list-price purple-clr">
                  <h5>0% complete </h5>
                  <p>$60,000 of $60,000</p>
                </div>
              </div>
            </div>
            {/* graph-box-result */}
            <div className="graph-box-result">
              <div className="result-item purple-clr">
                <h5>Total Budget:</h5>
              </div>
              <div className="result-price purple-clr">
                <h5>$ 125,000.00</h5>
              </div>
            </div>
            <div className="graph-box-result">
              <div className="result-item blue-clr">
                <h5>Total Budget:</h5>
              </div>
              <div className="result-price blue-clr">
                <h5>$ 125,000.00</h5>
              </div>
            </div>
            <div className="graph-box-result">
              <div className="result-item golden-clr">
                <h5>Total Budget:</h5>
              </div>
              <div className="result-price golden-clr">
                <h5>$ 125,000.00</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Campaigns;
