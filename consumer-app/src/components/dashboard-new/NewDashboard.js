import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./dashboard.css";
import "./index.css";
import Alert from "../shared/Alert";
import { Row, Col, Container } from "reactstrap";

import DashboardTabs from "./DashboardTabs";
import ContentTabs from "./ContentTabs";

import moment from "moment";
import runTheContent from "../helpers/GetToken";
import axios from "axios";
import {
  setVideDataAnalytics,
  setVideAPIAnalytics,
  setVideCollaborators,
  setVideoCollaboratorsStatistics,
  setYoutubeOwnVideo,
  refreshDashBoard,
} from "../../actions/dashboard";
import { setYoutubeData } from "../../actions/index.js";

function NewDashboard() {
  const { user } = useSelector((state) => ({
    user: state.user.user,
  }));

  const dispatch = useDispatch();
  const yt = useSelector((state) => state.youtube.video);
  const [analytics, setAnalytics] = useState([]);
  const [analyticsAPI, setAnalyticsAPI] = useState([]);
  const [collaborators, setCollabortors] = useState(0);
  const [collaboratorStatistics, setCollaboratorStatistics] = useState([]);
  const [memberSince, setMemberSince] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  let loaded = useSelector((state) => state.dashboard.refresh);

  const [collaboratorSnippet, setCollaboratorSnippet] = useState([]);
  const [hasRT, setHasRT] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem("token");

    fetch("/users/getrT", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((message) => {
        const { rT } = message;
        dispatch(refreshDashBoard(true));
        setHasRT(rT);
      });
  }, []);

  const getVideoList = () => {
    runTheContent((accessToken) => {
      if (!accessToken || accessToken === "undefined") return;

      fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true&maxResults=50&type=video&key=${
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
            setErrorMsg(
              "It seems youtube quota for the day is over.some of the youtube features might not work properly"
            );
          } else {
            if (data.items) {
              const info =
                data.items[0].contentDetails.relatedPlaylists.uploads;
              fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${info}&key=${process.env.REACT_APP_APIKEY}`,
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
                  dispatch(setYoutubeOwnVideo(data.items));

                  // TODO set state
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            } else {
              setError(true);
              setErrorMsg(
                "it seems you dn't have youtube channel.please Create one"
              );
            }
          }
        });
    });
  };

  var ids = [];
  if (yt.length) {
    yt.forEach((v) => {
      if (v.checked) {
        ids.push(v.videoId);
      }
    });
    ids = ids.join();
  }

  useEffect(() => {
    if (!loaded) {
      // get video list for current user

      getVideoList();
    }
  }, [loaded]);

  useEffect(() => {
    axios
      .get("/api/list-collaborators", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setCollabortors(res.data.collaborators);
        dispatch(setVideCollaborators(res.data.collaborators));

        res.data.collaborators.forEach((item) => {
          getToken(item.user, item.owner, item.videoId, item.role);
        });

        setMemberSince(res.data.memberSince);
      })
      .catch((error) => {
        console.log("Somethign went wrong", error);
      });
  }, []);
  const getAnalytics = () => {
    if (!yt.length) {
      return;
    }

    /***********Function to fetch Video List */
    const getVideoList = () => {
      runTheContent((accessToken) => {
        if (!accessToken) return;

        let youtubeV = [...yt];
        axios
          .get(
            `https://www.googleapis.com/youtube/v3/videos?part=statistics, snippet&id=${ids}&key=${process.env.REACT_APP_APIKEY}`,
            {
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer " + accessToken,
              },
            }
          )
          .then((res) => {
            const hash = { commentCount: 0, likeCount: 0, viewCount: 0 };

            youtubeV.forEach((vid, index) => {
              res.data.items.forEach((item, i) => {
                if (item.id == vid.videoId) {
                  vid.statistics = item.statistics;
                  hash.commentCount =
                    hash.commentCount + parseInt(item.statistics.commentCount);
                  hash.likeCount =
                    hash.likeCount + parseInt(item.statistics.likeCount);
                  hash.viewCount =
                    hash.viewCount + parseInt(item.statistics.viewCount);
                }
              });
            });

            dispatch(setYoutubeData(youtubeV));

            dispatch(setVideDataAnalytics(hash));
            dispatch(refreshDashBoard(true));
            setAnalytics(hash);
          })
          .catch((err) => console.log("Errrr", err));

        if (ids.length) {
          axios
            .get(
              `https://youtubeanalytics.googleapis.com/v2/reports?endDate=2020-12-12&dimensions=video&ids=channel==MINE&filters=${
                ids.length ? "video==" + ids : ""
              }&metrics=annotationClickThroughRate,views,shares,comments,likes,dislikes,estimatedMinutesWatched&startDate=2017-01-01&key=${
                process.env.REACT_APP_APIKEY
              }`,
              {
                headers: {
                  "Content-type": "application/json",
                  Authorization: "Bearer " + accessToken,
                },
              }
            )
            .then((res) => {
              const hash = {};
              let youtubevid = youtubeV;

              res.data.rows.forEach((item, ri) => {
                const stat = {};
                for (var i = 0; i < res.data.rows[ri].length; i++) {
                  //  TODO update the hash code to each video of redux
                  // as statisctics of each video is added
                  hash[res.data.columnHeaders[i].name] = hash[
                    res.data.columnHeaders[i].name
                  ]
                    ? hash[res.data.columnHeaders[i].name]
                    : 0 + res.data.rows[ri][i];
                  stat[res.data.columnHeaders[i].name] = res.data.rows[ri][i];
                }
                youtubevid.forEach((item) => {
                  if (item.videoId == res.data.rows[ri][0]) {
                    item.stat = stat;
                  }
                });
              });
              setAnalyticsAPI(hash);
              dispatch(refreshDashBoard(true));
              dispatch(setYoutubeData(youtubevid));
              dispatch(setVideAPIAnalytics(hash));
            })
            .catch((err) => console.log("Errrr", err));
        } else {
          setAnalyticsAPI([]);

          dispatch(setVideAPIAnalytics([]));
        }
      });
    };

    getVideoList();
  };
  useEffect(() => {}, [collaboratorStatistics]);
  React.useMemo(() => {
    if (!loaded) {
      getAnalytics();
    }
  }, [yt]);
  const getToken = (user, owner, videoID, role) => {
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
        console.log("GetToken.js", "something went wrong");
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

          // const publisherName = headers.headers.publisherName;
          // TODO! set youtube video publisher name
          if (!token) return "Need to authenticate first";

          getCollabortorsVAnalytics(
            token,
            videoID,
            headers.data.publisherName,
            role
          );
        });
    });
  };

  const temp = [];
  const getCollabortorsVAnalytics = (
    accessToken,
    videoID,
    publisherName,
    role
  ) => {
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet, statistics&id=${videoID}&key=${process.env.REACT_APP_APIKEY}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      )
      .then((res) => {
        res.data.items[0].selected = true;
        res.data.items[0].publisherName = publisherName;
        res.data.items[0].publisherRole = role;

        temp.push(res.data.items[0]);
        setCollaboratorStatistics(temp);

        dispatch(setVideoCollaboratorsStatistics(temp));

        res.data.items[0].snippet.videoID = videoID;

        setCollaboratorSnippet([
          ...collaboratorSnippet,
          res.data.items[0].snippet,
        ]);
      })
      .catch((err) => console.log("response VA Err", err));
  };
  return (
    <Container className="dashboard-main">
      <Row>
        <Col sm="6">
          <div className="profile-detail">
            <div className="profile-logo-container">
              <img
                alt="avatar icon"
                className="profile-logo"
                src={require("../../assets/images/icons/profile-avatar.svg")}
              />
            </div>

            <div className="profile-name">
              <h2>{user && user.displayName}</h2>
              <label>
                User Since{" "}
                {memberSince
                  ? moment(memberSince).format("MMMM DD[,] YYYY")
                  : moment(new Date()).format("MMMM DD[,] YYYY")}
              </label>
            </div>
          </div>
        </Col>
        <Col sm="2" className="d-none d-sm-block">
          <div
            onClick={() => {
              dispatch(refreshDashBoard(false));
            }}
            className="profile-detail refresh-btn-wrap"
          >
            <div className="refresh_btn">
              <i
                className="fa fa-refresh"
                aria-hidden="true"
                color="#c3c333"
              ></i>
            </div>
            <span> Refresh</span>
          </div>
        </Col>
        <Col sm="4" className="d-none d-sm-block">
          <div className="profile-detail">
            <img
              alt="reverb score icon"
              className="reverb-icon"
              src={require("../../assets/images/icons/reverb-score-big.svg")}
            />

            <div className="profile-name">
              <h2 style={{ color: "#0099CD" }}>N/A</h2>
              <label id="reverbScore">Reverb Score</label>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-md-5 mt-3">
        <Col sm="8">
          {!loaded ? (
            <div className="img-graph-loader">
              <img
                alt="content-loader"
                src={require("../../assets/images/content-loader.svg")}
              />
            </div>
          ) : null}
          <DashboardTabs
            analytics={analytics}
            analyticsAPI={analyticsAPI}
            collaborators={collaborators}
            memberSince={memberSince}
            loaded={loaded}
          />
        </Col>

        <Col sm="4" className="d-none d-sm-block">
          <ContentTabs collaboratorSnippet={collaboratorSnippet} />
        </Col>
      </Row>
      {error ? (
        <div className="required-popup">
          <div className="popup_inner">
            <h5>Error</h5>
            <div className="p-content">
              <p>{errorMsg}</p>
            </div>
            <div className="required-content_dashboard">
              <button
                onClick={() => {
                  setError("");
                  setError(false);
                  window.location.href = "https://www.youtube.com/";
                }}
                className="btn btn-primary"
              >
                Link Now
              </button>
              <button
                onClick={() => {
                  setError("");
                  setError(false);
                }}
                className="btn btn-primary"
              >
                Latter
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {errorMsg.length ? (
        <div className="required-popup">
          <div className="popup_inner">
            <h5>Error</h5>
            <div className="p-content">
              <p>{errorMsg}</p>
            </div>
            <div className="required-content">
              <a
                onClick={() => {
                  setErrorMsg("");
                }}
                className="btn btn-primary"
              >
                OK
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </Container>
  );
}

export default NewDashboard;
