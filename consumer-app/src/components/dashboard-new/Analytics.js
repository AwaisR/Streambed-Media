import React, { useState, useEffect } from "react";

import AreaChartComp from "./chart/AreaChart";
import LineChartComp from "./chart/LineChartComp";
import axios from "axios";
import runTheContent from "../helpers/GetToken";
import { useSelector } from "react-redux";
import moment from "moment";
import loader from "../../assets/images/content-loader.svg";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  UncontrolledPopover,
  Popover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";

function Analytics(props) {
  const yt = useSelector((state) => state.youtube.video);
  useEffect(() => {
    setLoading(true);
    getVideoAnalytics();
  }, [yt]);
  const youtubeCollaborator = useSelector(
    (state) => state.dashboard.videoCollaborator
  );
  const youtubeCollaboratorStat = useSelector(
    (state) => state.dashboard.videoCollaboratorsStatistics
  );
  const [data, setData] = useState([]);

  const [analytics, setAnalytics] = useState([]);
  const [collAnalytics, setCollAnalytics] = useState([]);
  const [collAnalyticsLoaded, setCollAnalyticsLoaded] = useState(false);

  const [loading, setLoading] = useState(true);
  const [reach, setReach] = useState([]);

  const [range, setRange] = useState({
    startDate: moment().subtract(1, "months").format("yyyy-MM-DD"),
    endDate: moment().format("yyyy-MM-DD"),
  });
  const [duration, setDuration] = useState("1M");

  useEffect(() => {
    // setLoading(true);
    getCollaboratorAnalytics();
  }, [youtubeCollaboratorStat]);

  if (yt.length) var ids = [];
  if (yt.length) {
    yt.forEach((v) => {
      if (v.checked) {
        ids.push(v.videoId);
      }
    });
    ids = ids.join();
  }

  useEffect(() => {
    if (analytics?.length > collAnalytics?.length) {
      const newArray = analytics.map((aItem) => {
        let obj = collAnalytics.find((col) => col.title == aItem.title);

        if (obj) {
          let temp = {
            averageViewDuration:
              obj.averageViewDuration + aItem.averageViewDuration,
            comments: obj.comments + aItem.comments,
            estimatedMinutesWatched:
              obj.estimatedMinutesWatched + aItem.estimatedMinutesWatched,
            likes: obj.likes + aItem.likes,
            shares: obj.shares + aItem.shares,
            subscribersGained: obj.subscribersGained + aItem.subscribersGained,
            title: obj.title,
            type: obj.type,
            views: obj.views + aItem.views,
          };

          return { ...temp };
        } else {
          return { ...aItem };
        }
      });
      setData(newArray);
    } else {
      const newArray = collAnalytics.map((aItem) => {
        let obj = analytics.find((col) => col.title == aItem.title);

        if (obj) {
          let temp = {
            averageViewDuration:
              obj.averageViewDuration + aItem.averageViewDuration,
            comments: obj.comments + aItem.comments,
            estimatedMinutesWatched:
              obj.estimatedMinutesWatched + aItem.estimatedMinutesWatched,
            likes: obj.likes + aItem.likes,
            shares: obj.shares + aItem.shares,
            subscribersGained: obj.subscribersGained + aItem.subscribersGained,
            title: obj.title,
            type: obj.type,
            views: obj.views + aItem.views,
            publisherName: obj.publisherName,
            publisherRole: obj.publisherRole,
          };
          return { ...temp };
        } else {
          return { ...aItem };
        }
      });
      setData(newArray);
    }
  }, [analytics, collAnalytics]);

  const getCollaboratorAnalytics = () => {
    youtubeCollaborator.forEach(async (vid) => {
      youtubeCollaboratorStat.forEach(async (item) => {
        if (item.id === vid.videoId && item.selected) {
          await getToken(vid.user, vid.owner, vid.videoId);
        }
      });
    });
  };

  const getToken = (user, owner, videoID) => {
    const tokenPromise = new Promise(function (resolve, reject) {
      const token = window.localStorage.getItem("token");
      fetch(`/users/ref-token/${user}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
          owner: `${owner}`,
        },
      }).then((res) => {
        if (res.status === 500) {
          reject("somethign went wrong");
          return;
        }
        res
          .json()
          .then((data) => ({
            headers: [...res.headers].reduce((acc, header) => {
              return { ...acc, [header[0]]: header[1] };
            }, {}),
            status: res.status,
            data: data,
          }))
          .then((headers, status, data) => {
            const token = headers.headers.authorization;
            if (!token) {
              reject("Need to authenticate first");
            }

            resolve({
              token,
              videoID,
              publisherName: headers.data.publisherName,
              publisherRole: headers.data.publisherRole,
            });
          });
      });
    });
    tokenPromise
      .then((res) => {
        getCollabortorsVAnalytics(
          res.token,
          res.videoID,
          res.publisherName,
          res.publisherRole
        );
      })
      .catch((err) => err);
  };

  const getCollabortorsVAnalytics = (
    accessToken,
    videoID,
    publisherName,
    publisherRole
  ) => {
    const { startDate, endDate } = range;
    axios
      .get(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&sort=day&metrics=estimatedMinutesWatched,averageViewDuration,views,comments,likes,subscribersGained,shares&ids=channel==MINE&startDate=${startDate}&endDate=${endDate}&filters=${
          "video==" + videoID
        }&key=${process.env.REACT_APP_APIKEY}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      )
      .then((res) => {
        const { data } = res;

        if (data.error) {
          console.log("something went wrong");
        } else {
          const tempGraphData = [];
          data.rows.forEach((item) => {
            let obj = {};
            item.forEach((el, index) => {
              obj["publisherName"] = publisherName;
              obj["publisherRole"] = publisherRole;
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
          setCollAnalytics(tempGraphData);
        }
      })
      .catch((err) => console.log("response VA Err", err));
  };

  const getVideoAnalytics = () => {
    setLoading(true);

    if (yt.length < 1) return;

    runTheContent((accessToken) => {
      if (!accessToken) return;

      const { startDate, endDate } = range;

      fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&sort=day&metrics=estimatedMinutesWatched,averageViewDuration,views,comments,likes,subscribersGained,shares&ids=channel==MINE&startDate=${startDate}&endDate=${endDate}&filters=${
          ids.length ? "video==" + ids : ""
        }&maxResults=1000&key=${
          process.env.REACT_APP_APIKEY
        }&_=${Math.random()}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.log("something went wrong");
          } else {
            const tempGraphData = [];
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
            setAnalytics(tempGraphData);
            setLoading(false);
          }
        });
    });
  };
  const handleDateFilter = (type) => {
    setDuration(type);
    const endDate = moment().format("yyyy-MM-DD");
    let startDate = moment().format("yyyy-MM-DD");
    switch (type) {
      case "4h":
        startDate = moment().subtract(4, "hours").format("yyyy-MM-DD");
        break;
      case "12h":
        startDate = moment().subtract(12, "hours").format("yyyy-MM-DD");
        break;
      case "1D":
        startDate = moment().subtract(1, "days").format("yyyy-MM-DD");
        break;
      case "3D":
        startDate = moment().subtract(3, "days").format("yyyy-MM-DD");

        break;
      case "1W":
        startDate = moment().subtract(7, "days").format("yyyy-MM-DD");
        break;
      case "1M":
        startDate = moment().subtract(1, "months").format("yyyy-MM-DD");

        break;
      case "3M":
        startDate = moment().subtract(3, "months").format("yyyy-MM-DD");
        break;

      case "6M":
        startDate = moment().subtract(6, "months").format("yyyy-MM-DD");
        break;

      case "1Y":
        startDate = moment().subtract(1, "years").format("yyyy-MM-DD");
        break;

      case "5Y":
        startDate = moment().subtract(5, "years").format("yyyy-MM-DD");
        break;

      case "MAX":
        startDate = moment().subtract(20, "years").format("yyyy-MM-DD");
        break;
      default:
        break;
    }
    setRange({ ...range, startDate, endDate });
  };
  useEffect(() => {
    setLoading(true);
    setCollAnalyticsLoaded(false);
    async function getmatrics() {
      setLoading(true);
      await getVideoAnalytics();
      await getCollaboratorAnalytics();
      setCollAnalyticsLoaded(true);
    }
    getmatrics();
  }, []);

  useEffect(() => {
    setLoading(true);
    async function getmatrics() {
      setCollAnalyticsLoaded(false);
      await getVideoAnalytics();
      await getCollaboratorAnalytics();
      setCollAnalyticsLoaded(true);
      setLoading(false);
    }
    getmatrics();
  }, [range]);

  useEffect(() => {
    let reachData = [];
    data.forEach((item) => {
      let r = {
        name: "",
        reach: 0,
        engagement: 0,
        amplication: 0,
      };
      r.name = item.title;
      // TODO! remove views -added now for dummy results for graph
      // TODO ensure proper analytics go to respective field

      r.reach = item.views;
      r.engagement = item.comments + item.likes;
      r.amplication = item.shares;

      reachData.push(r);
    });
    setLoading(false);

    setReach(reachData);
  }, [data]);

  const chartTypes = {
    ENGAGEMENT: "Engagement",
    REACH: "Reach",
    AMPLICATION: "Shares",
  };

  const [selectedChart, setSelectedChart] = useState(chartTypes.REACH);
  const [popOver, setPopOver] = useState(`  `);
  const setGraph = (graph) => {
    setSelectedChart(graph);
  };

  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  const getPopOverReach = () => {
    return (
      <>
        <button
          id="analyticsQ"
          type="button"
          className="fa fa-question-circle-o questionMark"
        ></button>
        <UncontrolledPopover
          trigger="focus"
          placement="bottom"
          target="analyticsQ"
        >
          <PopoverHeader className="popoverTitle">Reach</PopoverHeader>
          <PopoverBody className="popoverContent">
            Look how far your content has travelled! This is the combined reach
            of all your content across all connected platforms.
          </PopoverBody>
        </UncontrolledPopover>
      </>
    );
  };
  const getPopOverAmplication = () => {
    return (
      <>
        <button
          id="analyticsQ"
          type="button"
          className="fa fa-question-circle-o questionMark"
        ></button>
        <UncontrolledPopover
          trigger="focus"
          placement="bottom"
          target="analyticsQ"
        >
          <PopoverHeader className="popoverTitle">Shares</PopoverHeader>
          <PopoverBody className="popoverContent">
            Sharing is caring! This is the total amount of shares you've
            received across all platforms.
          </PopoverBody>
        </UncontrolledPopover>
      </>
    );
  };
  const getPopOverEngagement = () => {
    return (
      <>
        <button
          id="analyticsQ"
          type="button"
          className="fa fa-question-circle-o questionMark"
        ></button>
        <UncontrolledPopover
          trigger="focus"
          placement="bottom"
          target="analyticsQ"
        >
          <PopoverHeader className="popoverTitle">Engagement</PopoverHeader>
          <PopoverBody className="popoverContent">
            People really love what you're doing! This is your total likes,
            comments and retweets across your posts.
          </PopoverBody>
        </UncontrolledPopover>
      </>
    );
  };

  return (
    <div className="newdashboard-content">
      <div className="newcharts-wrap">
        {
          <div className="newcharts-container">
            <div className="row custom-gutters">
              <div className="col-xl-12">
                <div className="chart-box">
                  <h2 className="newchart-title">
                    {selectedChart}
                    {/* <sup className="fa fa-question-circle-o"></sup> */}
                    {/* <button className="fa fa-question-circle-o questionMark"></button> */}

                    {/* {getPopOver({ selectedChart })} */}
                    {selectedChart == "Reach" ? getPopOverReach() : null}
                    {selectedChart == "Shares" ? getPopOverAmplication() : null}
                    {selectedChart == "Engagement"
                      ? getPopOverEngagement()
                      : null}
                  </h2>

                  <div className="newcharts-checks">
                    <div className="newcharts-derivative">
                      <div className="charts-platform-select">
                        <label className="derivative-check checkmark-parent">
                          <input type="checkbox" />
                          <span className="checkmark"></span>
                        </label>
                        <label className="derivative-statement">
                          Include versioned content
                          {/* <sup className="fa fa-question-circle-o"></sup> */}
                        </label>
                      </div>
                      <div className="d-none d-md-block">
                        <div className="tags">
                          <a
                            onClick={() => handleDateFilter("4h")}
                            href="#"
                            className={`chartTags ${
                              duration == "4h" ? "active" : ""
                            }`}
                          >
                            4h
                          </a>
                          <a
                            onClick={() => handleDateFilter("8h")}
                            href="#"
                            className={`chartTags ${
                              duration == "8h" ? "active" : ""
                            }`}
                          >
                            12h
                          </a>
                          <a
                            onClick={() => handleDateFilter("1D")}
                            href="#"
                            className={`chartTags ${
                              duration == "1D" ? "active" : ""
                            }`}
                          >
                            1D
                          </a>
                          <a
                            onClick={(e) => {
                              handleDateFilter("3D");
                            }}
                            href="#"
                            className={`chartTags ${
                              duration == "3D" ? "active" : ""
                            }`}
                          >
                            3D
                          </a>
                          <a
                            onClick={() => handleDateFilter("1W")}
                            href="#"
                            className={`chartTags ${
                              duration == "1W" ? "active" : ""
                            }`}
                          >
                            1W
                          </a>
                          <a
                            onClick={() => handleDateFilter("1M")}
                            href="#"
                            className={`chartTags ${
                              duration == "1M" ? "active" : ""
                            }`}
                          >
                            1M
                          </a>
                          <a
                            onClick={() => handleDateFilter("3M")}
                            href="#"
                            className={`chartTags ${
                              duration == "3M" ? "active" : ""
                            }`}
                          >
                            3M
                          </a>
                          <a
                            onClick={() => handleDateFilter("6M")}
                            href="#"
                            className={`chartTags ${
                              duration == "6M" ? "active" : ""
                            }`}
                          >
                            6M
                          </a>
                          <a
                            onClick={() => handleDateFilter("1Y")}
                            href="#"
                            className={`chartTags ${
                              duration == "1Y" ? "active" : ""
                            }`}
                          >
                            1Y
                          </a>
                          <a
                            onClick={() => handleDateFilter("5Y")}
                            href="#"
                            className={`chartTags ${
                              duration == "5Y" ? "active" : ""
                            }`}
                          >
                            5Y
                          </a>
                          <a
                            onClick={() => handleDateFilter("MAX")}
                            href="#"
                            className={`chartTags ${
                              duration == "MAX" ? "active" : ""
                            }`}
                          >
                            MAX
                          </a>
                        </div>
                      </div>
                      <div className="d-block d-md-none custom-dropdown filterDate">
                        <ButtonDropdown
                          isOpen={dropdownOpen}
                          toggle={toggle}
                          className="dropdownToggle"
                        >
                          <DropdownToggle caret>Filter by time</DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() => handleDateFilter("4h")}
                              className={`chartTags ${
                                duration == "4h" ? "active" : ""
                              }`}
                            >
                              4h
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateFilter("8h")}
                              className={`chartTags ${
                                duration == "8h" ? "active" : ""
                              }`}
                            >
                              12h
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateFilter("1D")}
                              className={`chartTags ${
                                duration == "1D" ? "active" : ""
                              }`}
                            >
                              1D
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateFilter("3D")}
                              className={`chartTags ${
                                duration == "3D" ? "active" : ""
                              }`}
                            >
                              3D
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateFilter("1W")}
                              className={`chartTags ${
                                duration == "1W" ? "active" : ""
                              }`}
                            >
                              1W
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateFilter("1M")}
                              className={`chartTags ${
                                duration == "1M" ? "active" : ""
                              }`}
                            >
                              1M
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateFilter("3M")}
                              className={`chartTags ${
                                duration == "3M" ? "active" : ""
                              }`}
                            >
                              3M
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateFilter("6M")}
                              className={`chartTags ${
                                duration == "6M" ? "active" : ""
                              }`}
                            >
                              6M
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateFilter("1Y")}
                              className={`chartTags ${
                                duration == "1Y" ? "active" : ""
                              }`}
                            >
                              1Y
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateFilter("5Y")}
                              className={`chartTags ${
                                duration == "5Y" ? "active" : ""
                              }`}
                            >
                              5Y
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateFilter("MAX")}
                              className={`chartTags ${
                                duration == "MAX" ? "active" : ""
                              }`}
                            >
                              MAX
                            </DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                      </div>
                    </div>
                    {/* <div className="newcharts-derivative">
                      <div className="charts-platform-select">
                        <label className="checkmark-parent">
                          <input type="checkbox" />
                          <span className="checkmark"></span>
                        </label>
                        <img
                          style={{ marginLeft: "20px" }}
                          className="activity-logo"
                          src={require("../../assets/images/icons/twitter-outline.svg")}
                        />
                      </div>
                      <div className="charts-platform-select">
                        <label className="checkmark-parent">
                          <input type="checkbox" />
                          <span className="checkmark"></span>
                        </label>

                        <img
                          style={{ marginLeft: "20px" }}
                          className="activity-logo"
                          src={require("../../assets/images/icons/youtube-outline.svg")}
                        />
                      </div>
                      <div className="charts-platform-select">
                        <label className="checkmark-parent">
                          <input type="checkbox" />
                          <span className="checkmark"></span>
                        </label>

                        <img
                          style={{ marginLeft: "20px" }}
                          className="activity-logo"
                          src={require("../../assets/images/icons/snapchat-outline.svg")}
                        />
                      </div>
                    </div> */}
                  </div>
                  <div className="numimpressions">
                    # of Impressions{" "}
                    {/* <sup className="fa fa-question-circle-o"></sup> */}
                  </div>

                  {loading ? (
                    props.loaded ? (
                      <div className="img-graph-loader">
                        {" "}
                        <img src={loader} alt="loader" />{" "}
                      </div>
                    ) : null
                  ) : null}

                  {selectedChart == chartTypes.REACH ? (
                    <AreaChartComp data={reach} type="reach" />
                  ) : null}

                  {selectedChart == chartTypes.AMPLICATION ? (
                    <AreaChartComp
                      data={reach}
                      title={"dsfds"}
                      type="amplication"
                    />
                  ) : null}
                  {selectedChart == chartTypes.ENGAGEMENT ? (
                    <AreaChartComp
                      data={reach}
                      title={"dkdkkd"}
                      type="engagement"
                    />
                  ) : null}
                </div>
              </div>
              <div className="col-4 mb-3 mb-md-0">
                <div
                  onClick={() => {
                    setGraph(chartTypes.REACH);
                  }}
                  className={`chart-btn ${
                    selectedChart == chartTypes.REACH
                      ? " chart-btn-focus"
                      : null
                  }`}
                >
                  <div className="btn-chartInner">
                    {" "}
                    <AreaChartComp
                      data={reach}
                      cardDisplay={true}
                      type="reach"
                    />
                  </div>
                  <span className="chartTitle">{chartTypes.REACH}</span>
                </div>
              </div>
              <div className="col-4 mb-3 mb-md-0">
                <div
                  onClick={() => {
                    setGraph(chartTypes.ENGAGEMENT);
                  }}
                  className={`chart-btn ${
                    selectedChart == chartTypes.ENGAGEMENT
                      ? "chart-btn-focus"
                      : null
                  }`}
                >
                  <div className="btn-chartInner">
                    <AreaChartComp
                      cardDisplay={true}
                      data={reach}
                      type="engagement"
                    />
                  </div>
                  <span className="chartTitle">{chartTypes.ENGAGEMENT}</span>
                </div>
              </div>
              <div className="col-4">
                <div
                  onClick={() => {
                    setGraph(chartTypes.AMPLICATION);
                  }}
                  className={`chart-btn ${
                    selectedChart == chartTypes.AMPLICATION
                      ? "chart-btn-focus"
                      : null
                  }`}
                >
                  <div className="btn-chartInner">
                    <AreaChartComp
                      cardDisplay={true}
                      data={reach}
                      type="amplication"
                    />
                  </div>
                  <span className="chartTitle">{chartTypes.AMPLICATION}</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default Analytics;
