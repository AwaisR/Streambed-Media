import React, { useState, useEffect } from "react";
import "./anylatics.css";
import "../Overview/overview.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";

import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import logo from "../../../assests/images/logo.svg";
import Profile from "Containers/Profile";
import { useSelector, useDispatch } from "react-redux";
import { Select } from "./Selectdropdown";
import { anylaticActions } from "../../../store/anylatics/action";
import { Dropdown, DropdownToggle, Button, Form } from "react-bootstrap";
import { Chart } from "./Chart";
import moment from "moment";
import CoprateUser from "Containers/CoprateUser";
import TopPerformars from "Containers/TopPerformars";
import axios from "axios";
import Sidebar from "Components/Dashboard/Sidebar/Sidebar";
const Analytics = () => {
  const [weeks, setWeeks] = useState("1M");
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();
  const state = useSelector((state) => state.Analytics);
  const stateMagnify = useSelector((state) => state.Magnify);
  const { CompanyAnylatics } = state;
  const { PaidVideos } = stateMagnify;
  const [totalView, setTotalView] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [accessToken, setAccessToken] = useState("");
  const [duration, setDuration] = useState([]);
  const [engagement, setEngagement] = useState(0);
  const [tabClick, setTabClick] = useState("REACH");
  const [graphName, setGraphName] = useState("Reach");
  const [activeApply, setActiveApply] = useState(false);
  const [paidChecked, setPaidChecked] = useState(false);
  const [range, setRange] = useState({
    startDate: moment(Date.now()).subtract(1, "months").format("yyyy-MM-DD"),
    endDate: moment(Date.now()).format("yyyy-MM-DD"),
  });
  let ids = [];
  useEffect(() => {
    if (CompanyAnylatics.data) {
      const promisses = [];
      CompanyAnylatics &&
        CompanyAnylatics.data &&
        CompanyAnylatics.data.posts.forEach((item) => {
          if (CompanyAnylatics.accessToken) {
            promisses.push(
              getAnylatics(item.VideoId, CompanyAnylatics.accessToken)
            );
          }
        });

      promisses.length &&
        Promise.all(promisses).then((responses) => {
          const tempGraphData = [];
          responses.forEach(({ data }) => {
            if (data.error) {
              console.log("something went wrong");
            }
            data &&
              data.rows.forEach((item) => {
                let obj = {};
                item.forEach((el, index) => {
                  if (
                    data.columnHeaders[index].name != "day" &&
                    data.columnHeaders[index].name != "month"
                  ) {
                    obj[data.columnHeaders[index].name] = el;
                  } else {
                    obj["title"] = el;
                    obj["type"] = data.columnHeaders[index].name;
                  }
                });
                tempGraphData.push(obj);
              });
          });
          setDuration(tempGraphData);
        });
    }
  }, [CompanyAnylatics]);
  const handleApply = () => {
    setActiveApply(true);
    if (!paidChecked) {
      if (CompanyAnylatics.data) {
        const promisses = [];
        CompanyAnylatics &&
          CompanyAnylatics.data &&
          CompanyAnylatics.data.posts.forEach((item) => {
            if (CompanyAnylatics.accessToken) {
              promisses.push(
                getAnylatics(item.VideoId, CompanyAnylatics.accessToken)
              );
            }
          });

        promisses.length &&
          Promise.all(promisses).then((responses) => {
            const tempGraphData = [];
            responses.forEach(({ data }) => {
              if (data.error) {
                console.log("something went wrong");
              }
              data &&
                data.rows.forEach((item) => {
                  let obj = {};
                  item.forEach((el, index) => {
                    if (
                      data.columnHeaders[index].name != "day" &&
                      data.columnHeaders[index].name != "month"
                    ) {
                      obj[data.columnHeaders[index].name] = el;
                    } else {
                      obj["title"] = el;
                      obj["type"] = data.columnHeaders[index].name;
                    }
                  });
                  tempGraphData.push(obj);
                });
            });
            setDuration(tempGraphData);
          });
      }
    } else {
      const promisses = [];
      CompanyAnylatics &&
        CompanyAnylatics.data &&
        CompanyAnylatics.data.posts.forEach((item) => {
          if (CompanyAnylatics.accessToken) {
            if (item.videoprice) {
              promisses.push(
                getAnylatics(item.VideoId, CompanyAnylatics.accessToken)
              );
            }
          }
        });

      promisses.length &&
        Promise.all(promisses).then((responses) => {
          const tempGraphData = [];
          responses.forEach(({ data }) => {
            if (data.error) {
              console.log("something went wrong");
            }
            data &&
              data.rows.forEach((item) => {
                let obj = {};
                item.forEach((el, index) => {
                  if (
                    data.columnHeaders[index].name != "day" &&
                    data.columnHeaders[index].name != "month"
                  ) {
                    obj[data.columnHeaders[index].name] = el;
                  } else {
                    obj["title"] = el;
                    obj["type"] = data.columnHeaders[index].name;
                  }
                });
                tempGraphData.push(obj);
              });
          });
          setDuration(tempGraphData);
        });
    }
  };
  useEffect(() => {
    if (!paidChecked) {
      if (CompanyAnylatics.data) {
        const promisses = [];
        CompanyAnylatics &&
          CompanyAnylatics.data &&
          CompanyAnylatics.data.posts.forEach((item) => {
            if (CompanyAnylatics.accessToken) {
              promisses.push(
                getAnylatics(item.VideoId, CompanyAnylatics.accessToken)
              );
            }
          });

        promisses.length &&
          Promise.all(promisses).then((responses) => {
            const tempGraphData = [];
            responses.forEach(({ data }) => {
              if (data.error) {
                console.log("something went wrong");
              }
              data &&
                data.rows.forEach((item) => {
                  let obj = {};
                  item.forEach((el, index) => {
                    if (
                      data.columnHeaders[index].name != "day" &&
                      data.columnHeaders[index].name != "month"
                    ) {
                      obj[data.columnHeaders[index].name] = el;
                    } else {
                      obj["title"] = el;
                      obj["type"] = data.columnHeaders[index].name;
                    }
                  });
                  tempGraphData.push(obj);
                });
            });
            setDuration(tempGraphData);
          });
      }
    } else {
      const promisses = [];
      CompanyAnylatics &&
        CompanyAnylatics.data &&
        CompanyAnylatics.data.posts.forEach((item) => {
          if (CompanyAnylatics.accessToken) {
            if (item.videoprice) {
              promisses.push(
                getAnylatics(item.VideoId, CompanyAnylatics.accessToken)
              );
            }
          }
        });

      promisses.length &&
        Promise.all(promisses).then((responses) => {
          const tempGraphData = [];
          responses.forEach(({ data }) => {
            if (data.error) {
              console.log("something went wrong");
            }
            data &&
              data.rows.forEach((item) => {
                let obj = {};
                item.forEach((el, index) => {
                  if (
                    data.columnHeaders[index].name != "day" &&
                    data.columnHeaders[index].name != "month"
                  ) {
                    obj[data.columnHeaders[index].name] = el;
                  } else {
                    obj["title"] = el;
                    obj["type"] = data.columnHeaders[index].name;
                  }
                });
                tempGraphData.push(obj);
              });
          });
          setDuration(tempGraphData);
        });
    }
  }, [paidChecked]);
  const getAnylatics = (videoID, accessToken) => {
    const { startDate, endDate } = range;
    if (accessToken) {
      return axios.get(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&sort=day&metrics=estimatedMinutesWatched,averageViewDuration,views,comments,likes,subscribersGained,shares&ids=channel==MINE&startDate=${startDate}&endDate=${endDate}&filters=${
          "video==" + videoID
        }&key=${process.env.REACT_APP_APIKEY}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      );
    }
  };
  const token = localStorage.getItem("token");
  const handleSelectWeek = (type) => {
    setActiveApply(false);
    const endDate = moment().format("yyyy-MM-DD");
    let startDate = moment(Date.now()).format("yyyy-MM-DD");
    switch (type) {
      case "1h":
        startDate = moment(Date.now())
          .subtract(1, "hours")
          .format("yyyy-MM-DD");
        break;
      case "3h":
        startDate = moment(Date.now())
          .subtract(3, "hours")
          .format("yyyy-MM-DD");
        break;
      case "12h":
        startDate = moment(Date.now())
          .subtract(12, "hours")
          .format("yyyy-MM-DD");
        break;
      case "1D":
        startDate = moment(Date.now()).subtract(1, "days").format("yyyy-MM-DD");
        break;
      case "3D":
        startDate = moment(Date.now()).subtract(3, "days").format("yyyy-MM-DD");
        break;
      case "7D":
        startDate = moment(Date.now()).subtract(7, "days").format("yyyy-MM-DD");
        break;
      case "1M":
        startDate = moment(Date.now())
          .subtract(1, "months")
          .format("yyyy-MM-DD");
        break;
      case "3M":
        startDate = moment(Date.now())
          .subtract(3, "months")
          .format("yyyy-MM-DD");
        break;
      case "6M":
        startDate = moment(Date.now())
          .subtract(6, "months")
          .format("yyyy-MM-DD");
        break;
      case "1M":
        startDate = moment(Date.now())
          .subtract(1, "months")
          .format("yyyy-MM-DD");
        break;
      case "All":
        startDate = moment(Date.now())
          .subtract(5, "years")
          .format("yyyy-MM-DD");
        break;
      default:
        break;
    }
    setRange({ ...range, startDate, endDate });
    setWeeks(type);
  };
  useEffect(() => {
    dispatch(anylaticActions.CompanyVideosAnylatics(token));
  }, []);
  useEffect(() => {
    let View = 0;
    let Comments = 0;
    let Likes = 0;
    let shares = 0;
    duration.length &&
      duration.map((anylatic) => {
        View = View + parseInt(anylatic.views);
        Comments = Comments + parseInt(anylatic.comments);
        Likes = Likes + parseInt(anylatic.likes);
        shares = shares + parseInt(anylatic.shares);
      });
    let Engagement = 0;
    Engagement = (Likes + Comments + shares) / View;
    let TotalEngagement = Engagement.toString().substring(0, 5);
    setEngagement(TotalEngagement);
    setTotalShares(shares);
    setTotalView(View);
    setTotalComments(Comments);
    setTotalLikes(Likes);
  }, [duration]);
  const handleClickTab = (name) => {
    setTabClick(name);
  };
  const ChangeGraphName = (name) => {
    setGraphName(name);
  };
  const paidVideoAnylatics = (e) => {
    setPaidChecked(e.target.checked);
  };
  return (
    <>
      <Sidebar />
      <div className="main-outer anylatic-section">
        <div className="main-contant ">
          {/*main-heading */}
          <div className="main-heading">
            <div className="title">
              <h1>Analytics </h1>
            </div>
            <div className="box-selector">
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label=""
                  checked={paidChecked}
                  onChange={paidVideoAnylatics}
                />
                <span className="paidCheck">Paid Content Only</span>
              </Form.Group>
              <Button
                variant="success"
                // className="graph-btn"
                className={activeApply ? "graph-btn active" : "graph-btn"}
                onClick={handleApply}
              >
                Apply
              </Button>{" "}
              <Dropdown>
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  className="graph-btn"
                >
                  {weeks ? weeks : "Week"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {Select.map((select, i) => (
                    <Dropdown.Item
                      key={i}
                      onClick={() => handleSelectWeek(select.name)}
                    >
                      {select.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          <div className="graph-item-outer">
            <div className="graph-item">
              <div
                className="graph-box"
                onClick={() => handleClickTab("REACH")}
              >
                <div className="box-heading">
                  <div className="title">
                    <h4>REACH</h4>
                  </div>
                  <div className="box-selector">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </div>
                </div>
                <div className="box-content">
                  <h3>{totalView}</h3>
                </div>
                <p className="weeks-day">Week</p>
                <div className="box-bottom">
                  <div className="perc">
                    <h4>0.00%</h4>
                  </div>
                  <div className="value">
                    <h4>0</h4>
                  </div>
                </div>
              </div>
              <div
                className="graph-box"
                onClick={() => handleClickTab("POST-ENGAGEMENT")}
              >
                <div className="box-heading">
                  <div className="title">
                    <h4>Post Engagement</h4>
                  </div>
                  <div className="box-selector">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </div>
                </div>
                <div className="box-content">
                  <h3>
                    {engagement
                      ? engagement === "NaN"
                        ? "0"
                        : engagement
                      : "0"}
                  </h3>
                </div>
                <p className="weeks-day">Week</p>
                <div className="box-bottom">
                  <div className="perc">
                    <h4>0.00%</h4>
                  </div>
                  <div className="value">
                    <h4>0</h4>
                  </div>
                </div>
              </div>
              <div
                className="graph-box"
                onClick={() => handleClickTab("SHARES")}
              >
                <div className="box-heading">
                  <div className="title">
                    <h4>Shares</h4>
                  </div>
                  <div className="box-selector">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </div>
                </div>
                <div className="box-content">
                  <h3>{totalShares}</h3>
                </div>
                <p className="weeks-day">Week</p>
                <div className="box-bottom">
                  <div className="perc">
                    <h4>0.00%</h4>
                  </div>
                  <div className="value">
                    <h4>0</h4>
                  </div>
                </div>
              </div>

              <div className="graph-box">
                <div className="box-heading">
                  <div className="title">
                    <h4>Daily Spend</h4>
                  </div>
                  <div className="box-selector">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </div>
                </div>
              </div>
              {/* </div> */}
              {/* <div className="graph-item"> */}
              <div
                className="graph-box"
                onClick={() => handleClickTab("ContributionReach")}
              >
                <div className="box-heading">
                  <div className="title">
                    <h4>Contribution Reach</h4>
                  </div>
                  <div className="box-selector">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </div>
                </div>
                <div className="box-content">
                  <h3>{totalView}</h3>
                </div>
                <p className="weeks-day">Week</p>
                <div className="box-bottom">
                  <div className="perc">
                    <h4>0.00%</h4>
                  </div>
                  <div className="value">
                    <h4>0</h4>
                  </div>
                </div>
              </div>
              <div
                className="graph-box"
                onClick={() => handleClickTab("ContributionEngagement")}
              >
                <div className="box-heading">
                  <div className="title">
                    <h4>Contribution Engagement</h4>
                  </div>
                  <div className="box-selector">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </div>
                </div>
                <div className="box-content">
                  <h3>{totalComments}</h3>
                </div>
                <p className="weeks-day">Week</p>
                <div className="box-bottom">
                  <div className="perc">
                    <h4>0.00%</h4>
                  </div>
                  <div className="value">
                    <h4>0</h4>
                  </div>
                </div>
              </div>
              <div
                className="graph-box"
                onClick={() => handleClickTab("ContributionShares")}
              >
                <div className="box-heading">
                  <div className="title">
                    <h4>Contribution Shares</h4>
                  </div>
                  <div className="box-selector">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </div>
                </div>
                <div className="box-content">
                  <h3>{totalLikes}</h3>
                </div>
                <p className="weeks-day">Week</p>
                <div className="box-bottom">
                  <div className="perc">
                    <h4>0.00%</h4>
                  </div>
                  <div className="value">
                    <h4>0</h4>
                  </div>
                </div>
              </div>
              <div className="graph-box">
                <div className="box-heading">
                  <div className="title">
                    <h4>New Data Categories Coming Soon</h4>
                  </div>
                  <div className="box-selector">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="boder-bottom"></div>

          <div className="graph-box">
            <div className="box-heading">
              <div className="title">
                <h4>{graphName}</h4>
              </div>
              <div className="box-selector">
                <div className="social-icon-list">
                  <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="" />
                    <FontAwesomeIcon icon={faYoutube} />
                  </Form.Group>
                  <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="" />
                    <FontAwesomeIcon icon={faInstagram} />
                  </Form.Group>
                  <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="" />
                    <FontAwesomeIcon icon={faTwitter} />
                  </Form.Group>
                  <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="" />
                    <FontAwesomeIcon icon={faFacebook} />
                  </Form.Group>
                  <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="All" />
                  </Form.Group>
                </div>
              </div>
            </div>
            <Chart
              totalView={totalView}
              duration={duration}
              engagement={engagement}
              tabClick={tabClick}
              ChangeGraphName={ChangeGraphName}
            />
          </div>
        </div>
        {/* {/ right-bar-fixed /} */}
        <div className={toggle ? "right-bar active" : "right-bar"}>
          <div className={toggle ? "mobile-btn change-btn" : "mobile-btn"}>
            {!toggle ? (
              <FontAwesomeIcon
                icon={faAngleLeft}
                className="toggle-btn bar-icon"
                onClick={() => setToggle(!toggle)}
              />
            ) : (
              <FontAwesomeIcon
                icon={faAngleRight}
                className="cross-icon"
                onClick={() => setToggle(!toggle)}
              />
            )}
          </div>
          <Profile />
          <TopPerformars />
          <div className="boder-bottom"></div>
          <CoprateUser />
        </div>
      </div>
    </>
  );
};
export default Analytics;
