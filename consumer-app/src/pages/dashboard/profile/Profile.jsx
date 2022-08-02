import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import MainContent from "../shared/MainContent";

import runTheContent from "../../../components/helpers/GetToken";
import twitterApi from "../../../helpers/TwitterApi.js";
import OverviewSidebar from "../../../components/dashboard/OverviewSidebar";
import MyModal from "./MsgDisplayModel";
import {
  setVideDataAnalytics,
  setVideAPIAnalytics,
  setVideCollaborators,
  setVideoCollaboratorsStatistics,
  setYoutubeOwnVideo,
  refreshDashBoard,
} from "../../../actions/dashboard";
import { setYoutubeData } from "../../../actions/index.js";

export default function Profile({ Screen }) {
  let dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const yt = useSelector((state) => state.dashboard.youtubeVideo);
  const [isOpen, setIsOpen] = useState(false);
  // const [user, setUser] = useState(null);
  const user = useSelector((state) => state.user.user);

  let loaded = useSelector((state) => state.dashboard.refresh);
  const dashboard = useSelector((state) => state.dashboard);
  // const [collaboratorStatistics, setCollaboratorStatistics] = useState([]);
  const { videoCollaborator } = dashboard;
  const memberSince = useMemo(
    () => (user ? new Date(user.memberSince) : null),
    // eslint-disable-next-line
    []
    // eslint-disable-next-line
  );

  const [channelName, setChannelName] = useState("");
  const [zoomData, setZoom] = useState(null);
  const [instagram, setInstagram] = useState(null);
  const [facebook, setFacebook] = useState(null);
  const [linkedin, setLinkedin] = useState(null);
  const [twitter, setTwitterTokens] = useState(null);
  const [hasRT, setHasRT] = useState(false);
  // const [collaborators, setCollabortors] = useState(0);
  // const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const accounts = [
    {
      platform: "YouTube",
      username: channelName && channelName ? channelName : "YouTube",
      linked: hasRT ? true : false,
    },
    {
      platform: "Twitter",
      username: twitter ? `@${twitter.screen_name}` : "Twitter",
      linked: twitter && twitter.oauth_token ? true : false,
    },
    {
      platform: "Zoom",
      username: zoomData?.zoom_rT
        ? zoomData.first_name + " " + zoomData.last_name
        : "zoom",
      linked: zoomData ? true : false,
    },
    {
      platform: "Instagram",
      username: instagram?.first_name
        ? `${instagram?.first_name}  ${instagram?.last_name}`
        : "Instagram",
      linked: instagram && instagram.access_token ? true : false,
    },
    {
      platform: "Facebook",
      username: facebook?.first_name
        ? `${facebook?.first_name}  ${facebook?.last_name}`
        : "Facebook",
      linked: facebook && facebook.access_token ? true : false,
    },
    {
      platform: "TikTok",
      username: "MereGrey20",
      linked: false,
    },
    {
      platform: "Linkedin",
      username: linkedin?.first_name
        ? `${linkedin?.first_name}  ${linkedin?.last_name}`
        : "LinkedIn",
      linked: linkedin && linkedin.access_token ? true : false,
    },
  ];

  const linkedAccounts = accounts.filter((acc) => acc.linked);
  const linkableAccounts = accounts.filter((acc) => !acc.linked);

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

  useEffect(() => {
    if (!loaded) {
      // get video list for current use
      getVideoList();
    }
    // eslint-disable-next-line
  }, [loaded]);
  var ids = [];
  if (yt.length) {
    yt.forEach((v) => {
      if (v.checked) {
        ids.push(v.videoId);
      }
    });
    ids = ids.join();
  }
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

        // setMemberSince(new Date(res.data.memberSince));
      })
      .catch((error) => {
        console.log("Somethign went wrong", error);
      });
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
            console.log("Error", data.error.errors[0].message);
          } else {
            console.log(data);
            setChannelName(data && data.items && data.items[0].snippet.title);
          }
        });
    });
  };

  useEffect(() => {
    const getRT = () =>
      axios.get("/users/getrT", {
        headers: {
          authorization: `${token}`,
        },
      });

    const getTwitter = () => twitterApi.getTokens();

    Promise.all([getRT(), getTwitter()]).then(([rtRes, twitterRes]) => {
      const {
        rT,
        channelName,
        facebook,
        zoom,
        zoomIsActive,
        instagram,
        linkedin,
        twitterTokens,
      } = rtRes.data;
      setHasRT(rT);
      setChannelName(channelName);
      setFacebook(facebook);
      setZoom(zoomIsActive ? zoom : null);
      setInstagram(instagram);
      setLinkedin(linkedin);

      if (!channelName || channelName.length < 1) {
        getChannelName();
      }

      setTwitterTokens(twitterTokens);
    });
    // eslint-disable-next-line
  }, []);

  if (!user) return null;

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

        // setCollaboratorSnippet([
        //   ...collaboratorSnippet,
        //   res.data.items[0].snippet,
        // ]);
      })
      .catch((err) => console.log("response VA Err", err));
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
        <Screen
          user={user}
          memberSince={memberSince}
          linkedAccounts={linkedAccounts}
          linkableAccounts={linkableAccounts}
        />
      </MainContent>
      <div className="hidden lg:block lg:w-4/12 xl:w-3/12">
        <OverviewSidebar
          user={user || {}}
          memberSince={memberSince || new Date()}
          totalPosts={yt}
          channelName={channelName}
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
}
