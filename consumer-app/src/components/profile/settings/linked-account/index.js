import React, { useEffect, useState } from "react";
import twitterApi from "../../../../helpers/TwitterApi";
import Alert from "../../../shared/Alert";
import runTheContent from "../../../helpers/GetToken";
import { useDispatch } from "react-redux";
import { resetDashboard } from "../../../../actions/dashboard";
import axios from "axios";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import moment from "moment";
function LinkedAccount(props) {
  const dispatch = useDispatch();

  const [hasRT, setHasRT] = useState("");
  const [yconfirm, setYconfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [twitterTokens, setTwitterTokens] = useState(null);
  const [channelName, setChannelName] = useState();
  const [zoomData, setZoom] = useState({});
  const [instagram, setInstagram] = useState({ access_token: "" });
  const [facebook, setFacebook] = useState({ access_token: "" });
  const [linkedin, setLinkedin] = useState({ access_token: "" });
  const [unlinkName, setUnlinkName] = useState("");
  const [showAlertMessage, setShowAlertMessage] = useState("");
  const token = window.localStorage.getItem("token");
  const linkInstagramAccount = (name) => {
    const stringifiedParams = queryString.stringify({
      client_id: "593542318196587",
      redirect_uri: `${process.env.REACT_APP_URL}/instagram-auth2callback`,
      scope: ["instagram_basic", "pages_show_list"].join(","),
      response_type: "code",
      auth_type: "rerequest",
      display: "popup",
    });

    const facebookLoginUrl = `https://www.facebook.com/v9.0/dialog/oauth?${stringifiedParams}`;
    if (instagram.access_token.length) {
      setYconfirm(true);
      setUnlinkName(name);
    } else {
      window.location = facebookLoginUrl;
    }
  };

  const unlinkInstaAccount = () => {
    fetch("/api/instagram/instagram-revoke", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        setInstagram({ access_token: "" });
      });
  };
  const linkFacebookAccount = (name) => {
    const stringifiedParams = queryString.stringify({
      client_id: "593542318196587",
      redirect_uri: `${process.env.REACT_APP_URL}/facebook-auth2callback`,
      scope: [
        "pages_show_list",
        "user_posts",
        "pages_read_engagement",
        "pages_manage_posts",
        "publish_to_groups",
      ].join(","),
      response_type: "code",
      auth_type: "rerequest",
      display: "popup",
    });

    const facebookLoginUrl = `https://www.facebook.com/v9.0/dialog/oauth?${stringifiedParams}`;
    if (facebook.access_token.length) {
      setYconfirm(true);
      setUnlinkName(name);
    } else {
      window.location = facebookLoginUrl;
    }
  };
  const unlinkfacebookAccount = () => {
    fetch("/api/facebook/facebook-revoke", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        setFacebook({ access_token: "" });
      });
  };

  ////////////LinkedIn Account ///////
  const linkedInAccount = (name) => {
    const stringifiedParams = queryString.stringify({
      client_id: "7836qo1bk7bsv6",
      response_type: "code",
      redirect_uri: `${process.env.REACT_APP_URL}auth/linkedin/callback`,
      scope: [
        "r_liteprofile",
        "r_emailaddress",
        "w_organization_social",
        "r_organization_social",
        "w_member_social",
        "rw_organization_admin",
      ].join(","),
      state: `${token}`,
    });

    const LinkedInLoginUrl = `https://www.linkedin.com/oauth/v2/authorization?${stringifiedParams}`;
    if (linkedin.access_token.length) {
      setYconfirm(true);
      setUnlinkName(name);
    } else {
      window.location = LinkedInLoginUrl;
    }
  };
  const unlinkLinkedInAccount = () => {
    fetch("/api/linkedin/linkdin-revoke-account", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        // console.log("errror", res);
        setLinkedin({ access_token: "" });
      });
  };
  // A custom hook that builds on useLocation to parse
  // the query string
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();
  useEffect(() => {
    const access_token = query.get("access_token");

    // store zoom access token with expiry time (1 hour)
    if (access_token) {
      sessionStorage.setItem(
        "zoom",
        JSON.stringify({
          token: access_token,
          exp: moment().add(1, "hours"),
        })
      );
    }

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
          rT,
          channelName,
          zoom,
          zoom_rT,
          instagram,
          facebook,
          linkedin,
        } = message;
        setHasRT(rT);
        setZoom({ ...zoom, zoom_rT });
        if (!channelName || channelName.length < 1) {
          getChannelName();
        }
        setChannelName(channelName);
        setInstagram(instagram);
        setFacebook(facebook);
        setLinkedin(linkedin);
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
            setShowAlertMessage(
              "It seems youtube quota for the day is over.some of the youtube features might not work properly"
            );
            console.log("Error", data.error.errors[0].message);
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
    twitterApi.getTokens().then((res) => {
      setTwitterTokens(res);
    });
  }, []);

  const getRefreshToken = async () => {
    const response = await fetch("/api/youtube-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    });
    const data = await response.json();
    window.location.assign(data.url);
  };

  const deleteRefreshToken = async () => {
    let brt = hasRT;
    await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${hasRT}`);

    fetch("/users/deleterT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({
        rt: brt,
      }),
    }).then(() => {
      setHasRT("");
      setChannelName("Youtube");
      sessionStorage.clear();
    });
  };

  const hanelLinkAccount = (name) => {
    if (hasRT) {
      setYconfirm(true);
      setUnlinkName(name);
    } else {
      getRefreshToken();
    }
  };
  const confirmUnlink = () => {
    setYconfirm(false);
    return hasRT && unlinkName === "youtube"
      ? deleteRefreshToken()
      : instagram.access_token.length && unlinkName === "instagram"
      ? unlinkInstaAccount()
      : facebook.access_token.length && unlinkName === "facebook"
      ? unlinkfacebookAccount()
      : linkedin.access_token.length && unlinkName === "linkedIn"
      ? unlinkLinkedInAccount()
      : dispatch(resetDashboard());
  };

  const handleTwitterAccount = () => {
    if (!!twitterTokens && twitterTokens.isActive) {
      twitterApi.unauthenticate().then(() => {
        setTwitterTokens(null);
      });
    } else {
      twitterApi.autheticate().then((jsonResponse) => {
        const { redirectUrl } = jsonResponse;

        window.location.assign(redirectUrl);
      });
    }
  };
  useEffect(() => {
    fetchVideo();
    fetchVideos();
  }, []);

  const fetchVideo = async () => {
    try {
      await twitterApi.getTweet();
    } catch (err) {
      console.log("fetchVideo error", err);
    }
  };

  const fetchVideos = async () => {
    try {
      await twitterApi.getVideoList();
    } catch (err) {
      console.log("fetchVideos error", err);
    }
  };

  const handleZoomConnect = async () => {
    try {
      if (zoomData?.zoom_rT?.length) {
        const _t = JSON.parse(sessionStorage.getItem("zoom"));

        axios
          .get(`/api/zoom/zoom-revoke-access?access_token=${_t?.token}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then((data) => {
            if (data.data.status === "success") {
              setZoom({});
              sessionStorage.setItem("zoom", {});
            }
          })
          .catch((error) => {
            console.log("something went wrong", error);
          });

        return;
      }

      // window.location = `https://zoom.us/oauth/authorize?response_type=code&client_id=1v_tqI1dRhGUO11hvlZOOA&redirect_uri=https://26dbf2508e8a.ngrok.io/api/zoom/zoom-auth&state=${token}`;

      window.location = `https://zoom.us/oauth/authorize?response_type=code&client_id=1v_tqI1dRhGUO11hvlZOOA&redirect_uri=${process.env.REACT_APP_redirectURL}/api/zoom/zoom-auth&state=${token}`;
    } catch (error) {
      console.log("something went wrong", error);
    }
  };
  return (
    <>
      <div id="accounts" role="tabpanel" aria-labelledby="accounts-tab">
        <div className="linked-content">
          <div className="accounts-linked">
            <h3>Linked Accounts</h3>
            <ul>
              <li>
                <div className="linkIcon-name">
                  <img
                    alt="youtube-icon"
                    src={require("../../../../assets/images/youtube-icon.svg")}
                  />
                  <span>{channelName ? channelName : "Youtube"}</span>
                </div>
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    onChange={() => hanelLinkAccount("youtube")}
                    className="custom-control-input"
                    id="youtubeSwitch"
                    checked={hasRT}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="youtubeSwitch"
                  ></label>
                </div>
              </li>
              <li>
                <div className="linkIcon-name">
                  <img
                    alt="twitter-icon"
                    src={require("../../../../assets/images/twitter-icon.svg")}
                  />
                  <span>
                    {twitterTokens?.isActive
                      ? twitterTokens.screen_name
                      : "Twitter"}
                  </span>
                </div>
                <div className="custom-control custom-switch">
                  <input
                    onChange={handleTwitterAccount}
                    type="checkbox"
                    className="custom-control-input"
                    id="twitterSwitch"
                    checked={twitterTokens?.isActive ? true : false}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="twitterSwitch"
                  ></label>
                </div>
              </li>

              <li className="zoom_item">
                <div className="linkIcon-name">
                  <img
                    alt="twitter-icon"
                    src={require("../../../../assets/images/ZoomLogo.png")}
                  />
                  <span>
                    {zoomData?.zoom_rT ? (
                      zoomData.first_name + " " + zoomData.last_name
                    ) : (
                      <span>
                        Link Account <br />{" "}
                        <small>(Zoom Pro accounts only)</small>
                      </span>
                    )}
                  </span>
                </div>
                <div className="custom-control custom-switch">
                  <input
                    onChange={handleZoomConnect}
                    type="checkbox"
                    className="custom-control-input"
                    id="twitterSwitch2"
                    checked={zoomData?.zoom_rT?.length > 0}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="twitterSwitch2"
                  ></label>
                </div>
              </li>

              <li>
                <div className="linkIcon-name">
                  <img
                    alt="tiktok-icon"
                    src={require("../../../../assets/images/tikTok-icon.svg")}
                  />
                  <span>TikTok</span>
                </div>
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="tiktokSwitch"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="tiktokSwitch"
                  ></label>
                </div>
              </li>
              <li>
                <div className="linkIcon-name">
                  <img
                    alt="instagram-icon"
                    src={require("../../../../assets/images/instagram-icon.svg")}
                  />
                  <span>
                    {instagram.first_name
                      ? `${instagram?.first_name}  ${instagram?.last_name}`
                      : "Instagram"}
                  </span>
                </div>
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="instaSwitch"
                    onChange={() => linkInstagramAccount("instagram")}
                    checked={instagram.access_token?.length}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="instaSwitch"
                  ></label>
                </div>
              </li>

              <li>
                <div className="linkIcon-name">
                  <img
                    alt="instagram-icon"
                    src={require("../../../../assets/images/icons/fb.png")}
                  />
                  <span>
                    {facebook?.first_name
                      ? `${facebook?.first_name}  ${facebook?.last_name}`
                      : "Facebook"}
                  </span>
                </div>
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="facebookSwitch"
                    onChange={() => linkFacebookAccount("facebook")}
                    checked={facebook?.access_token?.length}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="facebookSwitch"
                  ></label>
                </div>
              </li>
              <li>
                <div className="linkIcon-name">
                  <img
                    alt="instagram-icon"
                    src={require("../../../../assets/images/icons/linkedin.png")}
                  />
                  <span>
                    {linkedin?.first_name
                      ? `${linkedin?.first_name}  ${linkedin?.last_name}`
                      : "LinkedIn"}
                    {/* LinkedIn */}
                  </span>
                </div>
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="LinkedInSwitch"
                    onChange={() => linkedInAccount("linkedIn")}
                    checked={linkedin?.access_token?.length}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="LinkedInSwitch"
                  ></label>
                </div>
              </li>
            </ul>
          </div>

          <button className="btn btn-primary" disabled>
            SAVE CHANGES
          </button>
        </div>

        {message.length > 0 ? (
          <Alert
            content={message}
            setAlert={() => {
              setMessage("");
            }}
          />
        ) : null}
        {showAlertMessage.length > 0 ? (
          <div className="required-popup">
            <div className="popup_inner">
              <h5>Error</h5>
              <div className="p-content">
                <p>{showAlertMessage}</p>
              </div>
              <div className="required-content">
                <a
                  onClick={() => {
                    setShowAlertMessage("");
                  }}
                  className="btn btn-primary"
                >
                  OK
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className={`unlink-popup ${!yconfirm ? "d-none" : null}`}>
        <div className="unlink-inner">
          <p>Are you sure you want to unlink your account?</p>
          <div className="unlink-row">
            <img
              src={require(`../../../../assets/images/${
                unlinkName === "youtube"
                  ? "youtube-icon.svg"
                  : unlinkName === "facebook"
                  ? "facebook-icon.svg"
                  : unlinkName === "instagram"
                  ? "instagram-icon.svg"
                  : unlinkName === "linkedIn"
                  ? "linkedin.svg"
                  : "twitter-icon.svg"
              }`)}
              alt="youtube-icon"
            />
            <span>
              {hasRT && unlinkName === "youtube"
                ? channelName
                : unlinkName === "facebook"
                ? facebook?.first_name
                  ? `${facebook?.first_name}  ${facebook?.last_name}`
                  : "Facebook"
                : unlinkName === "instagram"
                ? instagram.first_name
                  ? `${instagram?.first_name}  ${instagram?.last_name}`
                  : "Instagram"
                : unlinkName === "linkedIn"
                ? linkedin?.first_name
                  ? `${linkedin?.first_name}  ${linkedin?.last_name}`
                  : "linkedin"
                : ""}
            </span>
          </div>
          <div className="unlink-btns">
            <a
              onClick={() => setYconfirm(false)}
              href="#"
              className="btn btn-outline-primary"
            >
              CANCEL
            </a>
            <a onClick={confirmUnlink} href="#" className="btn btn-primary">
              UNLINK
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default LinkedAccount;
