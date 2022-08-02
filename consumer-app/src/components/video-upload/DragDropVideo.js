import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addVideo, setYTSiaURL } from "../../actions/index";
import axios from "axios";
import { classNames } from "classnames";
import { v4 as uuidv4 } from "uuid";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import ZoomImg from "../../assets/images/ZoomLogo.png";

function DragDropVideo(props) {
  sessionStorage.removeItem("videoTitle");
  sessionStorage.removeItem("videoid");
  const fileInput = React.useRef(null);

  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  let [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [zoomActive, setZoomAcive] = useState("");
  const [uploading, setUploading] = useState(false);
  const goToStepTwo = () => {
    props.videoUploaded(true);
  };
  if (sessionStorage.getItem("steps") === "1") {
    sessionStorage.removeItem("steps");
    goToStepTwo();
  }
  useEffect(() => {
    fetch("/users/getrT", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        const { zoomIsActive } = res;

        setZoomAcive(zoomIsActive);
      });
  }, []);

  function handleFiles() {
    const fileList = fileInput.current.files;
    var formData = new FormData();
    formData.append("body", "Title");
    formData.append("body", "Desc");
    formData.append("myFiles", fileList[0]);
    const vid = uuidv4();
    sessionStorage.setItem("vid", vid);

    setFile(fileList[0]);

    setUploading(true);

    axios
      .post("/api/uploaded", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          vid: vid,
        },
        onUploadProgress: function (progressEvent) {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      })
      .then((res) => {
        dispatch(setYTSiaURL(res.data.sia_url));
        setUploaded(false);
        setUploading(false);
        goToStepTwo();
      })
      .catch((error) => {
        console.log(error.response);
      });
    dispatch(addVideo(fileList[0]));
    return false;
  }

  const UploadInProgress = () => {
    return (
      <div>
        {progress < 90 ? (
          <div className="video-uploading ">
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={`${progress}`}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <h3 className="m-0 mt-4 mb-4">Video uploading…</h3>
            <button className="btn btn-primary cancel-video">Cancel</button>
          </div>
        ) : (
          <div className="tweet-loader">
            <div className="content-loader">
              <img
                alt="content-loader"
                src={require("~/assets/images/content-loader.svg")}
              />
              <span>Uploading to sia network please wait</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const DoneUpload = () => {
    return (
      <div className="finish-wrap">
        <div className="upload-finish">
          <img src={require("../../assets/images/check.png")} />
        </div>
        <h3>Done!</h3>
        {uploading ? (
          <div className="loader-modal">
            <div className="loader-modal-wrap">
              <div className="loader">
                <img
                  src={require("../../assets/images/videoUpload-loader.svg")}
                />{" "}
              </div>
              Uploading to sia Network please wait...
            </div>
          </div>
        ) : null}
      </div>
    );
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
              return record.file_type == "MP4";
            })[0];
          });
          setRecordings(_meetings);
          setLoading(false);
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
        `/api/zoom/download-recording?access_token=${token}&download_url=${url}`
      ).then(async (data) => {
        var formData = new FormData();
        formData.append("body", "Title");
        formData.append("body", "Desc");
        const videofile = new Blob([await data.arrayBuffer()]);
        formData.append("myFiles", videofile);

        const vid = uuidv4();
        sessionStorage.setItem("vid", vid);

        setFile(videofile);
        setLoading(false);

        axios
          .post("/api/uploaded", formData, {
            headers: {
              Authorization: localStorage.getItem("token"),
              vid: vid,
            },
            onUploadProgress: function (progressEvent) {
              var percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            },
          })
          .then((res) => {
            setUploaded(false);
            goToStepTwo();
          })
          .catch((error) => {
            console.log(error.response);
          });

        dispatch(addVideo(videofile));
        return false;
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
              refreshAccessToken();
            } else {
              getRecordings(token);
            }
          }
        }
      };
      zoomRecordHandler();
    }, [show]);
    return (
      <>
        {zoomActive && (
          <button className="block_btn" onClick={handleShow}>
            <img src={ZoomImg} />
            Upload from cloud recordings
          </button>
        )}

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
                  <div className="file-upload-zoom mb-3 d-flex align-items-center">
                    <div className="file_choosen">
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
                );
              })}
            </form>
          </Modal.Body>
          )
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  const DragNdrop = () => {
    return (
      <div id="dropbox" className="drag-video d-flex align-items-center">
        {zoomActive && (
          <>
            <ZoomVideo />
            <span>or</span>
          </>
        )}

        <div className={`${!zoomActive ? "youtube_files" : null}`}>
          <input
            ref={fileInput}
            className="myFiles"
            type="file"
            accept="video/*"
            className="btn btn-primary video-input-hide"
            onChange={handleFiles}
          />
          <button
            onClick={() => {
              fileInput.current.click();
            }}
            className="block_btn"
          >
            Browse your device{" "}
          </button>
        </div>
      </div>
    );
  };
  return (
    <>
      <div id="video-upload-tour" className="video-container">
        <h4>Select content</h4>
        <div className="upload-block">
          <div className="upload-inner">
            {file ? <UploadInProgress /> : <DragNdrop />}
          </div>
        </div>
      </div>
    </>
  );
}

export default DragDropVideo;
