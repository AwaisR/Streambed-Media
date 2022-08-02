import React, { useState, useEffect, useRef } from "react";
import { styled } from "twin.macro";
import Chart from "chart.js";
import moment from "moment";
// components
import Select from "../../components/forms/Select";
import MainContent from "./shared/MainContent";
import PageTitle from "./shared/PageTitle";
import { Card, CardContent } from "../../components/layouts/Card";
import CustomCheckbox from "../../components/forms/CustomCheckbox";
import ContentStreamSidebar from "./shared/ContentStreamSidebar";
import { analyticsColors } from "./shared/analyticsUtil";
import { useSelector, useDispatch } from "react-redux";
import runTheContent from "../../components/helpers/GetToken";
import { setContentStream } from "../../actions/index.js";
import { PDFExport } from "@progress/kendo-react-pdf";
// helpers
import {
  formatAbsoluteTime,
  formatNumberWithCommas,
} from "../../helpers/helper";
/// loading components ////
import AnalyticsLoading from "./content/AnalyticsLoading";

// seed
import * as seedAnalytics from "../seed/analytics";
import ReactiveAnalyticsCard from "./analytics/ReactiveAnalyticsCard";
import Button from "../../components/common/Button";
import axios from "axios";
import {
  setVideCollaborators,
  setVideoCollaboratorsStatistics,
} from "../../actions/dashboard";

const Analytics = () => {
  const contentData = useSelector((state) => state.youtube.contentVideos);
  const dashboard = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const { videoCollaboratorsStatistics } = dashboard;
  const [graphRange, setGraphRange] = useState("Quarter");
  const [graphTitle, setGraphTitle] = useState("Reach");
  const [mediaFilters, setMediaFilters] = useState([]);
  const [showAllMedia, setShowAllMedia] = useState(true);
  const canvasRef = useRef(null);
  const pdfGen = useRef(null);
  // const [collaborators, setCollabortors] = useState(0);
  const [instagramAnalytics, setInstagramAnalytics] = useState(null);
  const [tiktokAnalytics, setTiktokAnalytics] = useState(null);
  const [youtubeAnalytics, setYoutubeAnalytics] = useState(null);
  const [twitterAnalytics, setTwitterAnalytics] = useState(null);
  const [views, setViews] = useState([]);
  const [share, setShare] = useState([]);
  const [collaboratorSnippet, setCollaboratorSnippet] = useState([]);
  const [comments, setComments] = useState([]);
  const [duration, setDuration] = useState([]);
  // const [collabDuration, setCollabDuration] = useState([]);
  // const [engagement, setEngagement] = useState(0);
  // const [totalStatistics, setTotalStatistics] = useState();
  const [totalView, setTotalView] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  // const [totalLikes, setTotalLikes] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [previousShares, setPreviousShares] = useState(0);
  // const [collaboratorStatistics, setCollaboratorStatistics] = useState([]);
  const [previousView, setPreviousView] = useState(0);
  const [previousComments, setPreviousComments] = useState(0);
  const [contributionReach, setContributionReach] = useState(0);
  const [contributionEngagement, setContributionEngagement] = useState(0);
  const [contributionShare, setContributionShare] = useState(0);
  const [prevcontributionReach, setPrevContributionReach] = useState(0);
  // const [checkedAll, setCheckedAll] = useState(false);
  const [loadings, setLoadings] = useState(true);
  const [prevcontributionEngagement, setPrevContributionEngagement] = useState(
    0
  );
  const [prevcontributionShare, setPrevContributionShare] = useState(0);
  const [watchMinTime, setWatchMinTime] = useState(0);
  const [prevwatchMinTime, setPrevWatchMinTime] = useState(0);
  const totalStatistics = 0;
  // const [selectVideoAnalytics, setSelectVideoAnalytics] = useState([]);
  let token = localStorage.getItem("token");
  const [range, setRange] = useState({
    startDate: moment(Date.now()).subtract(4, "months").format("yyyy-MM-DD"),
    endDate: moment(Date.now()).format("yyyy-MM-DD"),
  });
  const [collAnalytics, setCollAnalytics] = useState({
    commentCount: 0,
    dislikeCount: 0,
    favoriteCount: 0,
    likeCount: 0,
    viewCount: 0,
  });
  const colors = analyticsColors;
  const currentViewCount = totalView;
  const previousViewCount = previousView;
  const viewChange = currentViewCount - previousViewCount;
  useEffect(() => {
    const promisses = [];
    var ids = [];
    if (contentData && contentData.length) {
      contentData.forEach((v) => {
        if (v.videoId && v.checked) {
          ids.push(v.videoId);
        } else {
          setYoutubeAnalytics({
            reach: [],
            engagement: [],
            shares: [],
          });
          setTotalView(0);
          setTotalComments(0);
          setTotalShares(0);
          setContributionReach(0);
          setWatchMinTime(0);
          setContributionEngagement(0);
          setContributionShare(0);
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
  }, [contentData, range]);
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
  // useEffect(() => {
  //   let View = 0;
  //   let Comments = 0;
  //   let Likes = 0;
  //   let shares = 0;
  //   if (collabDuration.length) {
  //     collabDuration.map((item) => {
  //       View = View + parseInt(item.views);
  //       Comments = Comments + parseInt(item.comments);
  //       Likes = Likes + parseInt(item.likes);
  //       shares = shares + parseInt(item.shares);
  //     });
  //     let Engagement = 0;
  //     Engagement = (Likes + Comments + shares) / View;
  //     let TotalEngagement = Engagement.toString().substring(0, 5);
  //     setContributionReach(View);
  //     setContributionEngagement(Comments);
  //     setContributionShare(shares);
  //   }
  // }, [collabDuration]);
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
  useEffect(() => {
    let View = 0;
    let Comments = 0;
    let Likes = 0;
    let shares = 0;
    let Minutswatched = 0;
    let Viewsdata = [];
    let CommentsData = [];
    let ShareData = [];
    if (duration.length) {
      duration.forEach((item) => {
        Minutswatched = Minutswatched + parseInt(item.estimatedMinutesWatched);
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
    setWatchMinTime(Minutswatched);
    // setEngagement(TotalEngagement);
    setTotalShares(shares);
    setTotalView(View);
    setTotalComments(Comments);
    // setTotalLikes(Likes);
    setComments(CommentsData);
    setViews(Viewsdata);
    setShare(ShareData);
  }, [duration]);
  const getContentData = () => {
    const token = localStorage.getItem("token");
    return fetch("/content/get-content-stream", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((posts) => {
        dispatch(setContentStream(posts.data));
        // console.log("posts", posts);
      })
      .catch((err) => {
        // setLoading(false);
      });
  };
  useEffect(() => {
    getContentData();
    // eslint-disable-next-line
  }, []);

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
      })
      .catch((error) => {
        console.log("Somethign went wrong", error);
      });
    // eslint-disable-next-line
  }, []);

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

  const toggleMediaFilter = (media, value) => {
    if (value) {
      setMediaFilters(mediaFilters.concat([media]));
    } else {
      setMediaFilters(mediaFilters.filter((m) => m !== media));
    }
  };

  const handleMediaFilterCheckboxChange = (evt) => {
    const { name, checked } = evt.target;
    toggleMediaFilter(name, checked);
  };

  // use the seeds
  useEffect(() => {
    setInstagramAnalytics(seedAnalytics.instagramAnalytics);
    setTiktokAnalytics(seedAnalytics.tiktokAnalytics);
    //setYoutubeAnalytics(seedAnalytics.youtubeAnalytics);
    setTwitterAnalytics(seedAnalytics.twitterAnalytics);
  }, []);
  useEffect(() => {
    setYoutubeAnalytics({
      reach: views && views,
      engagement: comments && comments,
      shares: share && share,
    });
    // eslint-disable-next-line
  }, [views]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    if (!mediaFilters.length && !showAllMedia) {
      return;
    }

    const allAnalytics = [
      instagramAnalytics,
      tiktokAnalytics,
      youtubeAnalytics,
      twitterAnalytics,
    ];
    if (allAnalytics.some((a) => !a)) {
      return;
    }

    const category = graphTitle.toLowerCase();
    const shouldShow = (media) => showAllMedia || mediaFilters.includes(media);
    const datasets = [
      // shouldShow("instagram") && {
      //   data: instagramAnalytics[category],
      //   fill: false,
      //   borderColor: colors["instagram"],
      //   cubicInterpolationMode: "monotone",
      //   tension: 0.4,
      // },
      // shouldShow("tiktok") && {
      //   data: tiktokAnalytics[category],
      //   fill: false,
      //   borderColor: colors["tiktok"],
      //   cubicInterpolationMode: "monotone",
      //   tension: 0.4,
      // },
      shouldShow("youtube") && {
        data: youtubeAnalytics[category],
        fill: false,
        borderColor: colors["youtube"],
        cubicInterpolationMode: "monotone",
        tension: 0.4,
      },
      // shouldShow("twitter") && {
      //   data: twitterAnalytics[category],
      //   fill: false,
      //   borderColor: colors["twitter"],
      //   cubicInterpolationMode: "monotone",
      //   tension: 0.4,
      // },
    ].filter(Boolean);

    const { current: canvas } = canvasRef;
    const ctx = canvas.getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: datasets[0] && datasets[0].data.map((_, i) => i + 1),
        datasets,
      },
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            title() {
              return null;
            },
            label(opts) {
              return formatNumberWithCommas(opts.value);
            },
          },
        },
        elements: {
          point: {
            radius: 2,
          },
        },
        layout: {
          padding: {
            top: 5,
            bottom: 5,
          },
        },
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: true,
              gridLines: {
                borderDash: [5, 5],
                drawBorder: false,
              },
              ticks: {
                beginAtZero: true,
                stepSize: 250000,
                callback(value) {
                  const ranges = [
                    { divider: 1e6, suffix: "m" },
                    { divider: 1e3, suffix: "k" },
                  ];
                  function formatNumber(n) {
                    for (let i = 0; i < ranges.length; i++) {
                      if (n >= ranges[i].divider) {
                        return (
                          Math.round(n / ranges[i].divider).toString() +
                          ranges[i].suffix
                        );
                      }
                    }
                    return n;
                  }
                  return formatNumber(value);
                },
              },
            },
          ],
        },
      },
    });

    return () => {
      chart.destroy();
      // eslint-disable-next-line
    };
    // eslint-disable-next-line
  }, [
    instagramAnalytics,
    tiktokAnalytics,
    youtubeAnalytics,
    twitterAnalytics,
    canvasRef,
    graphTitle,
    mediaFilters,
    showAllMedia,
  ]);
  const analyticsViewRange = (e) => {
    const date = e.target.value;
    setGraphRange(date);
    const endDate = moment().format("yyyy-MM-DD");
    let startDate = moment(Date.now()).format("yyyy-MM-DD");
    switch (date) {
      case "Day":
        startDate = moment(Date.now()).subtract(1, "days").format("yyyy-MM-DD");
        setPreviousView(totalView);
        setPrevWatchMinTime(watchMinTime);
        setPreviousComments(totalComments);
        setPreviousShares(totalShares);
        setPrevContributionReach(contributionReach);
        setPrevContributionEngagement(contributionEngagement);
        setPrevContributionShare(contributionShare);
        setTotalView(0);
        setTotalComments(0);
        setTotalShares(0);
        setContributionReach(0);
        setWatchMinTime(0);
        setContributionEngagement(0);
        setContributionShare(0);
        break;
      case "Month":
        startDate = moment(Date.now())
          .subtract(1, "months")
          .format("yyyy-MM-DD");
        setPreviousView(totalView);
        setPreviousComments(totalComments);
        setPrevWatchMinTime(watchMinTime);
        setPreviousShares(totalShares);
        setPrevContributionReach(contributionReach);
        setPrevContributionEngagement(contributionEngagement);
        setPrevContributionShare(contributionShare);
        setTotalView(0);
        setTotalComments(0);
        setTotalShares(0);
        setWatchMinTime(0);
        setContributionReach(0);
        setContributionEngagement(0);
        setContributionShare(0);
        break;
      case "Quarter":
        startDate = moment(Date.now())
          .subtract(4, "months")
          .format("yyyy-MM-DD");
        setPreviousView(totalView);
        setPreviousComments(totalComments);
        setPrevWatchMinTime(watchMinTime);
        setPreviousShares(totalShares);
        setPrevContributionReach(contributionReach);
        setPrevContributionEngagement(contributionEngagement);
        setPrevContributionShare(contributionShare);
        setTotalView(0);
        setWatchMinTime(0);
        setTotalComments(0);
        setTotalShares(0);
        setContributionReach(0);
        setContributionEngagement(0);
        setContributionShare(0);
        break;
      case "Year":
        startDate = moment(Date.now())
          .subtract(1, "years")
          .format("yyyy-MM-DD");
        setPreviousView(totalView);
        setPreviousComments(totalComments);
        setPreviousShares(totalShares);
        setPrevWatchMinTime(watchMinTime);
        setPrevContributionReach(contributionReach);
        setPrevContributionEngagement(contributionEngagement);
        setPrevContributionShare(contributionShare);
        setTotalView(0);
        setTotalComments(0);
        setWatchMinTime(0);
        setTotalShares(0);
        setContributionReach(0);
        setContributionEngagement(0);
        setContributionShare(0);
        break;
      default:
        break;
    }
    setRange({ startDate, endDate });
  };
  const checkAll = (e) => {
    const { checked } = e.target;
    fetch("/content/update-all-content-stream", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify({
        checked,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) getContentData();
      })
      .catch((err) => {
        // setLoading(false);
      });
  };
  const singleCheck = (e) => {
    const { checked, value } = e.target;
    fetch("/content/update-content-stream", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify({
        videoId: value,
        checked,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) getContentData();
      });
  };
  // useEffect(() => {
  //   dispatch(setYoutubeOwnVideo(selectVideoAnalytics));
  //   // eslint-disable-next-line
  // }, [selectVideoAnalytics]);
  const pdfGenerator = () => {
    pdfGen.current.save();
  };
  return (
    <div className="w-full flex">
      <MainContent className="w-full lg:w-8/12 xl:w-9/12">
        <div className="w-full flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0 md:items-end">
          <PageTitle>Analytics</PageTitle>
          <div className="flex justify-start flex-initial">
            <ExportButton
              className="mr-3 w-44"
              theme="none"
              onClick={pdfGenerator}
            >
              Export Data
            </ExportButton>
            <RangeSelect
              label=""
              name="range"
              value={graphRange}
              options={analyticsSelectRange}
              onChange={analyticsViewRange}
            />
          </div>
        </div>
        <PDFExport ref={pdfGen} fileName="anylatics">
          <div className="mt-6" id="content">
            {loadings ? (
              <AnalyticsLoading />
            ) : (
              <>
                <Card className="bg-white">
                  <CardContent>
                    <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:justify-between mb-4">
                      <h3 className="text-sm md:text-lg font-medium">
                        {graphTitle}
                      </h3>
                      <div className="text-xs md:text-sm ml-auto">
                        <div className="flex justify-between">
                          <span>Current:</span>
                          <span className="ml-2">
                            {formatNumberWithCommas(totalView)} total views
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Change:</span>
                          <span className="ml-2">
                            {previousViewCount < currentViewCount ? "+" : "-"}
                            {currentViewCount > 0
                              ? Math.abs(
                                  (viewChange / currentViewCount) * 100
                                ).toFixed(2)
                              : 0}
                            % | {formatNumberWithCommas(Math.abs(viewChange))}{" "}
                            views
                          </span>
                        </div>
                      </div>
                    </div>
                    {!mediaFilters.length && !showAllMedia ? (
                      <p className="text-center pb-8">Select a media filter</p>
                    ) : (
                      <canvas ref={canvasRef} height="80"></canvas>
                    )}
                    <div className="md:flex md:justify-end mt-3 space-x-4">
                      <CustomCheckbox
                        id="instagram"
                        name="instagram"
                        label="Instagram"
                        checkedClassName="bg-blue-400"
                        labelClassName="ml-1 text-xs md:text-sm"
                        onChange={handleMediaFilterCheckboxChange}
                      />
                      <CustomCheckbox
                        id="tiktok"
                        name="tiktok"
                        label="TikTok"
                        checkedClassName="bg-blue-600"
                        labelClassName="ml-1 text-xs md:text-sm"
                        onChange={handleMediaFilterCheckboxChange}
                      />
                      <CustomCheckbox
                        id="youtube"
                        name="youtube"
                        label="YouTube"
                        checkedClassName="bg-purple-400"
                        labelClassName="ml-1 text-xs md:text-sm"
                        onChange={handleMediaFilterCheckboxChange}
                      />
                      <CustomCheckbox
                        id="twitter"
                        name="twitter"
                        label="Twitter"
                        checkedClassName="bg-purple-700"
                        labelClassName="ml-1 text-xs md:text-sm"
                        onChange={handleMediaFilterCheckboxChange}
                      />
                      <CustomCheckbox
                        id="combined"
                        name="combined"
                        label="Combined"
                        checkedClassName="bg-purple-900"
                        labelClassName="ml-1 text-xs md:text-sm"
                        checked={showAllMedia}
                        onChange={(evt) => setShowAllMedia(evt.target.checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
                <hr className="my-6" />

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-4">
                    <ReactiveAnalyticsCard
                      title="Reach"
                      tooltip=""
                      currentValue={totalView}
                      previousValue={previousView}
                      rangeText={graphRange}
                      selected={graphTitle === "Reach"}
                      range={range}
                      onClick={() => setGraphTitle("Reach")}
                    />
                    <ReactiveAnalyticsCard
                      title="Contribution Reach"
                      tooltip=""
                      currentValue={
                        parseInt(collAnalytics.viewCount) +
                        (totalStatistics
                          ? parseInt(totalStatistics.viewCount)
                          : 0)
                      }
                      previousValue={prevcontributionReach}
                      rangeText={graphRange}
                      range={range}
                    />
                  </div>
                  <div className="space-y-4">
                    <ReactiveAnalyticsCard
                      title="Engagement"
                      tooltip=""
                      currentValue={totalComments}
                      previousValue={previousComments}
                      rangeText={graphRange}
                      selected={graphTitle === "Engagement"}
                      onClick={() => setGraphTitle("Engagement")}
                      range={range}
                    />
                    <ReactiveAnalyticsCard
                      title="Contribution Engagement"
                      tooltip=""
                      currentValue={contributionEngagement}
                      previousValue={prevcontributionEngagement}
                      rangeText={graphRange}
                      range={range}
                    />
                  </div>
                  <div className="space-y-4">
                    <ReactiveAnalyticsCard
                      title="Shares"
                      tooltip=""
                      currentValue={totalShares}
                      previousValue={previousShares}
                      rangeText={graphRange}
                      selected={graphTitle === "Shares"}
                      onClick={() => setGraphTitle("Shares")}
                      range={range}
                    />
                    <ReactiveAnalyticsCard
                      title="Contribution Shares"
                      tooltip=""
                      currentValue={contributionShare}
                      previousValue={prevcontributionShare}
                      rangeText={graphRange}
                    />
                  </div>
                  <div className="space-y-4">
                    <ReactiveAnalyticsCard
                      title="Reverb Score"
                      tooltip=""
                      currentValue={2_467}
                      previousValue={2_348}
                      rangeText={graphRange}
                      range={range}
                    />
                    <ReactiveAnalyticsCard
                      title="Watch Time"
                      tooltip=""
                      currentValue={watchMinTime}
                      previousValue={prevwatchMinTime}
                      rangeText={graphRange}
                      valueFormatter={formatAbsoluteTime}
                      range={range}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </PDFExport>
      </MainContent>
      <div className="hidden lg:block lg:w-4/12 xl:w-3/12">
        <ContentStreamSidebar
          // checkedAll={checkedAll}
          singleCheck={singleCheck}
          youtubeVideoFilterd={contentData}
          checkAll={checkAll}
          footer={
            <p className="text-xs">
              Select specific posts to show statistics regarding that group of
              data.
            </p>
          }
        />
      </div>
    </div>
  );
};

const RangeSelect = styled(Select)`
  width: 11rem;
  padding: 4px 12px;
`;

const ExportButton = styled(Button)`
  padding: 4px 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16);
`;

const analyticsSelectRange = (() => {
  const arr = ["Day", "Month", "Quarter", "Year"];
  return arr.reduce((rangeObj, opt) => {
    rangeObj[opt] = opt;
    return rangeObj;
  }, {});
})();

export default Analytics;
