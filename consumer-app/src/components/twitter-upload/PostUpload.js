import React, { useState, useEffect } from "react";
import Avatar from "../../assets/images/avatar.svg";
import moment from "moment";
import GalleryIcon from "../../assets/images/img-icon.svg";
import FooterTweet from "../../assets/images/footer-tweet-icon.svg";
import EmojiIcon from "../../assets/images/emoji-icon.svg";
import CalendarIcon from "../../assets/images/calendar-icon.svg";
import AddIcon from "../../assets/images/plus-icon.svg";
import "./index.css";
import axios from "axios";
import Alert from "../shared/Alert";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { Button, Modal } from "react-bootstrap";

import { useHistory } from "react-router-dom";
function PostUpload() {
  const history = useHistory();
  const [post, setPost] = useState("");
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState("");
  const [type, setType] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const twitterPost = (e) => {
    if (post.length < 1 && !preview.length) {
      // should select media or text or both
      return;
    }

    let formData = new FormData();
    formData.append("post", post);
    if (file) {
      formData.append("t-media", file);
    }
    setLoader(true);

    axios
      .post(`/api/twitter/post-video?post=${post}`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const { success, msg, tweet } = res.data;

        if (success) {
          setError(true);
          setErrorMsg(msg);
          setPost("");
          setPreview("");
        } else {
          setError(true);
          setErrorMsg(msg);
        }
        history.push("/twitter/post-upload/collaborator", {
          twitter: true,
          tweet: tweet,
        });
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function ZoomVideo() {
    const [recordings, setRecordings] = useState([]);
    const [loading, setLoading] = useState(true);
    const getRecordings = (access_token) => {
      fetch("/api/zoom/get-recordings?access_token=" + access_token, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const {
            body: { meetings },
          } = data;

          const _meetings = meetings.map((meeting) => {
            return meeting.recording_files.filter((record) => {
              return record.file_type === "MP4";
            })[0];
          });
          setLoading(false);
          setRecordings(_meetings);
        })
        .catch((error) => {
          console.log("something went wrong", error);
        });
    };
    const downloadFile = async (url) => {
      setLoading(true);
      const zoomSession = sessionStorage.getItem("zoom");
      const { exp, token } = JSON.parse(zoomSession);
      const diffs = moment().diff(exp, "minutes");
      if (diffs > -4) {
        return;
      }

      fetch(
        `/api/zoom/download-recording?access_token=${token}&download_url=${url}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
          },
        }
      ).then(async (data) => {
        const videofile = await new Blob([await data.arrayBuffer()]);

        const _file_link = URL.createObjectURL(videofile);
        setPreview(_file_link);
        setFile(videofile);
        setShow(false);
        setType("video");
      });
    };

    const refreshAccessToken = async () => {
      await fetch("/api/zoom/zoom-access-token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const access_token = data.data.access_token;
          if (access_token) {
            sessionStorage.setItem(
              "zoom",
              JSON.stringify({
                token: access_token,
                exp: moment().add(1, "hours"),
              })
            );
            getRecordings(access_token);
          }
        });
    };
    useEffect(() => {
      const zoomRecordHandler = async () => {
        if (show) {
          let zoomSession = sessionStorage.getItem("zoom");
          if (!zoomSession) {
            await refreshAccessToken();
            zoomSession = await sessionStorage.getItem("zoom");
          }
          const { exp, token } = JSON.parse(zoomSession);

          if (exp) {
            const diffs = moment().diff(exp, "minutes");
            if (diffs > -2) {
              // refresh access token
              refreshAccessToken();
            } else {
              getRecordings(token);
            }
          }
        }
      };
      zoomRecordHandler();
      // eslint-disable-next-line
    }, [show]);
    return (
      <>
        <button className="block_btn" onClick={handleShow}>
          <span style={{ color: "#0099cd", fontSize: "22px" }}>zoom</span>
        </button>

        <Modal className="zoom_modal" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Zoom recordings </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading ? (
              <div className="tweet-loader">
                <div className="content-loader">
                  <img
                    alt="content-loader"
                    src={require("~/assets/images/content-loader.svg")}
                  />
                </div>
              </div>
            ) : null}
            <div className="recording_title">
              <h6 className="mb-3">Recording Start</h6>
              <h6 className="mb-3">Recording End</h6>
            </div>
            <form
              action="/foo/bar.ext"
              method="post"
              enctype="multipart/form-data"
            >
              {recordings.map((item) => {
                return (
                  <>
                    <div className="file-upload-zoom mb-3 d-flex align-items-center">
                      <div className="file_choosen">
                        {/* <input type="file" name="filename" /> */}
                        <label>
                          {moment(item.recording_start).format(
                            "MMM DD, YYYY, h:mm a"
                          )}
                        </label>
                        -{" "}
                        <label>
                          {moment(item.recording_end).format(
                            "MMM DD, YYYY, h:mm a"
                          )}
                        </label>
                      </div>

                      <input
                        type="button"
                        value="Select"
                        className="btn btn-primary"
                        onClick={() => downloadFile(item.download_url)}
                      />
                    </div>
                  </>
                );
              })}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  function readURL(e) {
    setPreview(URL.createObjectURL(e.target.files[0]));
    const { type } = e.target.files[0];
    setType(type.split("/")[0]);
    setFile(e.target.files[0]);
  }
  return (
    <div className="tweet-popup">
      {loader ? (
        <div className="tweet-loader">
          <div className="content-loader">
            <img
              alt="content-loader"
              src={require("~/assets/images/content-loader.svg")}
            />
          </div>
        </div>
      ) : null}
      <div className="tweet-popupBox">
        <div className="tweet-popHeader">
          <div className="d-flex align-items-center">
            <button
              onClick={() => {
                history.push("/video-upload");
              }}
              className="tweet-close"
            >
              <i className="fa fa-times"></i>
            </button>
          </div>
        </div>
        <div className="tweet-popContent">
          <div className="tweetPop-head">
            <div className="post-avatar">
              <img src={Avatar} alt="avatar" />
            </div>
            <form>
              <input
                onChange={(e) => {
                  setPost(e.target.value);
                }}
                value={post}
                className="input-aboutTweet"
                placeholder="What’s happening?"
              />
            </form>
          </div>
          <div className={`tweet-inner ${!preview ? "d-none" : ""}`}>
            <div className="file-type">
              {preview.length ? (
                <button
                  onClick={() => {
                    setPreview("");
                    setFile("");
                  }}
                  className="file-close"
                >
                  {" "}
                  <i className="fa fa-times"></i>{" "}
                </button>
              ) : null}

              <form encType="multipart/form-data">
                <input
                  className="d-none"
                  id="myFile"
                  type="file"
                  onChange={(e) => {
                    readURL(e);
                  }}
                  accept="image/*, video/*"
                />
              </form>
              {type === "image" && preview.length ? (
                <img id="preview" src={preview} alt="post media preview" />
              ) : null}

              {preview.length ? (
                <video width="400" controls>
                  <source src={preview} id="video_here" />
                  Your browser does not support HTML5 video.
                </video>
              ) : null}
            </div>
          </div>
        </div>
        <div className="tweet-popFooter">
          <div className="row align-items-center">
            <div className="col-7">
              <ul>
                <li>{/* <img src={GifIcon} /> */}</li>
                <li>
                  <img
                    onClick={() => {
                      document.getElementById("myFile").click();
                    }}
                    src={GalleryIcon}
                    alt="icon"
                  />
                </li>
                <li>
                  <ZoomVideo />
                </li>
                <li>
                  <img src={FooterTweet} alt="icon" />
                </li>
                <li
                  onClick={() => {
                    setShowEmojis(!showEmojis);
                  }}
                >
                  <img src={EmojiIcon} alt="icon" />
                  {showEmojis ? (
                    <Picker
                      onSelect={(emo) => {
                        setPost(post + " " + emo.native);
                      }}
                    />
                  ) : null}
                </li>
                <li style={{ opacity: 0.4 }}>
                  <img src={CalendarIcon} alt="icon" />
                </li>
              </ul>
            </div>
            <div className="col-5">
              <div className="tweetFtr-right">
                <button className="add-btn">
                  <img src={AddIcon} alt="icon" />
                </button>
                <button
                  onClick={(e) => {
                    twitterPost(e);
                  }}
                  className="tweet-btn"
                >
                  Tweet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {error ? (
        <Alert
          content={errorMsg}
          setAlert={() => {
            setError("");
          }}
        />
      ) : null}
    </div>
  );
}

export default PostUpload;
