import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";

// components
import AnalysisCard from "../../components/analytics/ShortAnalysis";
import ShortAnalysisCard from "../../components/analytics/ShortAnalysisWithNoGraph";
import OverviewSidebar from "../../components/dashboard/OverviewSidebar";

import AnalyticsGraph from "./overview/AnalyticsGraph";
import MainContent from "./shared/MainContent";
import PageTitle from "./shared/PageTitle";

// helpers
import runTheContent from "../../components/helpers/GetToken";
import MyModal from "./profile/MsgDisplayModel";
///// loading components //////
import OverviewLoading from "./content/OverviewLoading";

// redux
import {
  setVideDataAnalytics,
  setVideAPIAnalytics,
  setVideCollaborators,
  setVideoCollaboratorsStatistics,
  setYoutubeOwnVideo,
  refreshDashBoard,
} from "../../actions/dashboard";
import { addUser } from "../../actions/index";
import { setYoutubeData } from "../../actions/index.js";

// seed
import {
  instagramAnalytics,
  tiktokAnalytics,
  twitterAnalytics,
} from "../seed/analytics";

const Overview = () => {
  const dispatch = useDispatch();
  const _user = useSelector((state) => state.user.user);
  // const yt = useSelector((state) => state.youtube.video);
  const yt = useSelector((state) => state.dashboard.youtubeVideo);
  const ytVideo = useSelector((state) => state.youtube);
  // const [analytics, setAnalytics] = useState([]);
  // const [analyticsAPI, setAnalyticsAPI] = useState([]);
  // const [collaborators, setCollabortors] = useState(0);
  // const [collaboratorStatistics, setCollaboratorStatistics] = useState([]);
  const [memberSince, setMemberSince] = useState("");
  // const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [channelName, setChannelName] = useState();
  const [zoomData, setZoom] = useState({});
  const [instagram, setInstagram] = useState({ access_token: "" });
  const [facebook, setFacebook] = useState({ access_token: "" });
  const [linkedin, setLinkedin] = useState({ access_token: "" });
  // const [showAlertMessage, setShowAlertMessage] = useState("");
  let loaded = useSelector((state) => state.dashboard.refresh);
  // const [watchMinTime, setWatchMinTime] = useState(0);
  const [totalStatistics, setTotalStatistics] = useState();
  const token = window.localStorage.getItem("token");
  const [collaboratorSnippet, setCollaboratorSnippet] = useState([]);
  // const [hasRT, setHasRT] = useState("");
  const dashboard = useSelector((state) => state.dashboard);
  const [duration, setDuration] = useState([]);
  const [totalView, setTotalView] = useState(0);
  const [views, setViews] = useState([]);
  // const [totalLikes, setTotalLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [totalShares, setTotalShares] = useState(0);
  const [share, setShare] = useState([]);
  const [twitter, setTwitter] = useState([]);
  // const [engagement, setEngagement] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [summaryTitle, setSummaryTitle] = useState("Views in past week");
  const [isOpen, setIsOpen] = useState(false);
  const [loadings, setLoadings] = useState(true);
  const [graphRange, setGraphRange] = useState("Day");
  const [collAnalytics, setCollAnalytics] = useState({
    commentCount: 0,
    dislikeCount: 0,
    favoriteCount: 0,
    likeCount: 0,
    viewCount: 0,
  });
  const { videoCollaboratorsStatistics, videoCollaborator } = dashboard;
  const [range, setRange] = useState({
    startDate: moment(Date.now()).subtract(7, "days").format("yyyy-MM-DD"),
    endDate: moment(Date.now()).format("yyyy-MM-DD"),
  });
  useEffect(() => {
    const promisses = [];

    var ids = [];
    if (yt.length) {
      yt.forEach((v) => {
        // setLoadings(true);
        if (v.snippet.resourceId) {
          ids.push(v.snippet.resourceId.videoId);
        }
      });
    }

    runTheContent((accessToken) => {
      if (!accessToken) return;
      ids &&
        ids.forEach((element) => {
          promisses.push(getAnylaticsYoutubeVideos(element, accessToken));
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
                    data.columnHeaders[index].name !== "day" &&
                    data.columnHeaders[index].name !== "month"
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
          setLoadings(false);
          setDuration(tempGraphData);
        });
    });
    // eslint-disable-next-line
  }, [yt, range]);
  useEffect(() => {
    setLoadings(true);
  }, [range]);
  const getAnylaticsYoutubeVideos = (videoID, accessToken) => {
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

  useEffect(() => {
    let View = 0;
    let Comments = 0;
    let Likes = 0;
    let shares = 0;
    let Viewsdata = [];
    let CommentsData = [];
    let ShareData = [];
    if (duration.length) {
      duration.forEach((item) => {
        View = View + parseInt(item.views);
        Comments = Comments + parseInt(item.comments);
        Likes = Likes + parseInt(item.likes);
        shares = shares + parseInt(item.shares);
        Viewsdata.push(item.views);
        CommentsData.push(item.comments);
        ShareData.push(item.shares);
      });
    }
    // let Engagement = 0;
    // Engagement = (Likes + Comments + shares) / View;
    // let TotalEngagement = Engagement.toString().substring(0, 5);
    // setEngagement(TotalEngagement);
    setTotalShares(shares);
    setTotalView(View);
    setTotalComments(Comments);
    // setTotalLikes(Likes);
    setComments(CommentsData);
    setViews(Viewsdata);
    setShare(ShareData);
  }, [duration]);
  useEffect(() => {
    let totalWatchTime = 0;
    let totalStattistics = {
      viewCount: 0,
      likeCount: 0,
      dislikeCount: 0,
      favoriteCount: 0,
      commentCount: 0,
    };
    ytVideo.video.forEach((item, i) => {
      if (item.checked) {
        const { stat, statistics } = item;
        if (stat) {
          totalWatchTime =
            totalWatchTime + parseInt(stat.estimatedMinutesWatched);
        }
        if (statistics) {
          totalStattistics.viewCount =
            totalStattistics.viewCount + parseInt(statistics?.viewCount);
          totalStattistics.likeCount =
            totalStattistics.likeCount + parseInt(statistics?.likeCount);
          totalStattistics.dislikeCount =
            totalStattistics.dislikeCount + parseInt(statistics?.dislikeCount);
          totalStattistics.favoriteCount =
            totalStattistics.favoriteCount +
            parseInt(statistics?.favoriteCount);
          totalStattistics.commentCount =
            totalStattistics.commentCount + parseInt(statistics?.commentCount);
        }
      }
    });
    setTotalStatistics(totalStattistics);
    // setWatchMinTime(totalWatchTime);
  }, [ytVideo]);

  useEffect(() => {
    let stat = {
      commentCount: 0,
      dislikeCount: 0,
      favoriteCount: 0,
      likeCount: 0,
      viewCount: 0,
    };

    videoCollaboratorsStatistics.forEach((item) => {
      const { statistics, selected } = item;
      if (selected) {
        stat.commentCount =
          stat.commentCount + parseInt(statistics.commentCount);
        stat.dislikeCount =
          stat.dislikeCount + parseInt(statistics.dislikeCount);
        stat.favoriteCount =
          stat.favoriteCount + parseInt(statistics.favoriteCount);
        stat.likeCount = stat.likeCount + parseInt(statistics.likeCount);
        stat.viewCount = stat.viewCount + parseInt(statistics.viewCount);
      }
    });
    setCollAnalytics(stat);
  }, [videoCollaboratorsStatistics]);
  const getUser = () => {
    const token = window.localStorage.getItem("token");
    axios
      .get("/users/getuser", { headers: { Authorization: token } })
      .then(function (response) {
        const { user } = response.data;

        dispatch(addUser(user));
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  };
  useEffect(() => {
    getUser();
    // eslint-disable-next-line
  }, []);

  const getChannelName = () => {
    runTheContent((accessToken) => {
      if (!accessToken || accessToken === "undefined") return;
      fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&key=
          ${process.env.REACT_APP_APIKEY}`,
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
            setIsOpen(true);
            setErrorMsg(
              "It seems youtube quota for the day is over.some of the youtube features might not work properly"
            );
          } else {
            fetch("/api/set-channel", {
              method: "POST",
              mode: "cors",
              cache: "no-cache",
              headers: {
                "Content-type": "application/json",
                authorization: `${token}`,
              },
              body: JSON.stringify({
                channelName: data && data.items && data.items[0].snippet.title,
              }),
            });
            setChannelName(data && data.items && data.items[0].snippet.title);
          }
        });
    });
  };
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
        const {
          // rT,
          channelName,
          zoom,
          zoom_rT,
          instagram,
          facebook,
          linkedin,
          twitterTokens,
        } = message;
        // dispatch(refreshDashBoard(true));
        setZoom({ ...zoom, zoom_rT });
        if (!channelName || channelName.length < 1) {
          getChannelName();
        }
        // setHasRT(rT);
        setTwitter(twitterTokens);
        setChannelName(channelName);
        setInstagram(instagram);
        setFacebook(facebook);
        setLinkedin(linkedin);
      });
    // eslint-disable-next-line
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
            setIsOpen(true);
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
              // setError(true);
              setIsOpen(true);
              setErrorMsg(
                "it seems you don't have youtube channel.please Create one"
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
    // get video list for current use
    getVideoList();
    // eslint-disable-next-line
  }, [loaded]);

  useEffect(() => {
    axios
      .get("/api/list-collaborators", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        // setCollabortors(res.data.collaborators);
        dispatch(setVideCollaborators(res.data.collaborators));

        res.data.collaborators.forEach((item) => {
          getToken(item.user, item.owner, item.videoId, item.role);
        });

        setMemberSince(new Date(res.data.memberSince));
      })
      .catch((error) => {
        console.log("Somethign went wrong", error);
      });
    // eslint-disable-next-line
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
                if (item.id === vid.videoId) {
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
            // setAnalytics(hash);
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
                  if (item.videoId === res.data.rows[ri][0]) {
                    item.stat = stat;
                  }
                });
              });
              // setAnalyticsAPI(hash);
              dispatch(refreshDashBoard(true));
              dispatch(setYoutubeData(youtubevid));
              dispatch(setVideAPIAnalytics(hash));
            })
            .catch((err) => console.log("Errrr", err));
        } else {
          // setAnalyticsAPI([]);

          dispatch(setVideAPIAnalytics([]));
        }
      });
    };

    getVideoList();
  };

  React.useMemo(() => {
    if (!loaded) {
      getAnalytics();
    }
    // eslint-disable-next-line
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
        // setCollaboratorStatistics(temp);

        dispatch(setVideoCollaboratorsStatistics(temp));

        res.data.items[0].snippet.videoID = videoID;

        setCollaboratorSnippet([
          ...collaboratorSnippet,
          res.data.items[0].snippet,
        ]);
      })
      .catch((err) => console.log("response VA Err", err));
  };
  const analyticsViewRange = (date) => {
    setGraphRange(date);
    const endDate = moment().format("yyyy-MM-DD");
    let startDate = moment(Date.now()).format("yyyy-MM-DD");
    switch (date) {
      case "Day":
        startDate = moment(Date.now()).subtract(1, "days").format("yyyy-MM-DD");
        setSummaryTitle("Views in last one day");
        setTotalView(0);
        setTotalComments(0);
        setTotalShares(0);
        break;
      case "Month":
        startDate = moment(Date.now())
          .subtract(1, "months")
          .format("yyyy-MM-DD");
        setSummaryTitle("Views in past one months");
        // setPreviousView(totalView);
        // setPreviousComments(totalComments);
        // setPreviousShares(totalShares);
        setTotalView(0);
        setTotalComments(0);
        setTotalShares(0);
        break;
      case "Quarter":
        startDate = moment(Date.now())
          .subtract(4, "months")
          .format("yyyy-MM-DD");
        setSummaryTitle("Views in past forth months");
        // setPreviousView(totalView);
        // setPreviousComments(totalComments);
        // setPreviousShares(totalShares);
        setTotalView(0);
        setTotalComments(0);
        setTotalShares(0);
        break;
      case "Year":
        startDate = moment(Date.now())
          .subtract(1, "years")
          .format("yyyy-MM-DD");
        setSummaryTitle("Views in past one year");
        // setPreviousView(totalView);
        // setPreviousComments(totalComments);
        // setPreviousShares(totalShares);
        setTotalView(0);
        setTotalComments(0);
        setTotalShares(0);
        break;
      default:
        break;
    }
    setRange({ startDate, endDate });
  };
  const youtubeAnalytics = {
    reach: views && views,
    engagement: comments && comments,
    shares: share && share,
  };
  const closeModal = () => {
    setIsOpen(false);
    setErrorMsg("");
  };
  return (
    <div className="flex w-full relative">
      {isOpen && (
        <MyModal
          isOpen={isOpen}
          title="Collaborators Error"
          closeModal={closeModal}
          description={errorMsg}
        />
      )}

      <MainContent className="w-full lg:w-8/12 xl:w-9/12">
        <div className="flex justify-between items-end">
          <PageTitle>Overview</PageTitle>
          <Link className="text-xs" to="/analytics">
            View all analytics
          </Link>
        </div>
        {loadings ? (
          <OverviewLoading />
        ) : (
          <>
            <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-center">
              <div className="space-y-4">
                <AnalysisCard
                  className="bg-white"
                  title="Your Reach"
                  tooltip=""
                  summaryTitle={summaryTitle}
                  points={views}
                  current={totalView}
                  // previous={previousView}
                  range={range && range}
                />
                <ShortAnalysisCard
                  className="h-32 bg-white"
                  title="Contribution Reach"
                  tooltip=""
                  summaryTitle={summaryTitle}
                  points={[
                    parseInt(collAnalytics.viewCount) +
                      (totalStatistics
                        ? parseInt(totalStatistics.viewCount)
                        : 0),
                  ]}
                />
              </div>
              <div className="space-y-4">
                <AnalysisCard
                  className="bg-white"
                  title="Post Engagement"
                  tooltip=""
                  summaryTitle={summaryTitle}
                  points={comments}
                  current={totalComments}
                  // previous={previousComments}
                  range={range && range}
                />
                <ShortAnalysisCard
                  className="h-32 bg-white"
                  title="Contribution Engagement"
                  tooltip=""
                  summaryTitle={summaryTitle}
                  points={[0]}
                />
              </div>
              <div className="space-y-4">
                <AnalysisCard
                  className="bg-white"
                  title="Post Shares"
                  tooltip=""
                  summaryTitle={summaryTitle}
                  points={share}
                  current={totalShares}
                  // previous={previousShares}
                  range={range && range}
                />
                <ShortAnalysisCard
                  className="h-32 bg-white"
                  title="Contribution Shares"
                  tooltip=""
                  summaryTitle={summaryTitle}
                  points={[0]}
                />
              </div>
            </div>
            <hr className="my-6" />
            <AnalyticsGraph
              instagramAnalytics={instagramAnalytics}
              tiktokAnalytics={tiktokAnalytics}
              youtubeAnalytics={youtubeAnalytics}
              twitterAnalytics={twitterAnalytics}
              analyticsViewRange={analyticsViewRange}
              range={range}
              graphRange={graphRange}
            />
          </>
        )}
      </MainContent>
      <div className="hidden lg:block lg:w-4/12 xl:w-3/12">
        <OverviewSidebar
          user={_user || {}}
          memberSince={memberSince}
          totalPosts={yt}
          channelName={channelName && channelName}
          linkedin={linkedin}
          facebook={facebook}
          zoomData={zoomData}
          instagram={instagram}
          videoCollaborator={videoCollaborator}
          twitter={twitter}
        />
      </div>
    </div>
  );
};

export default Overview;
