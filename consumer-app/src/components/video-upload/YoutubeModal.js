import React, { useEffect, useState } from "react";
import "./YoutubeModal.css";
import { useDispatch } from "react-redux";
import { setVideoStep, setUplaodProgress } from "../../actions/index";
import axios from "axios";
import Alert from "../shared/Alert";
import { socket } from "../helpers/socket";
import DragDropVideo from "./DragDropVideo";
function YoutubeModal() {
  const dispatch = useDispatch();
  const [ytStep, setytStepState] = useState(0);

  const setytStep = (value) => {
    setytStepState(value);
  };

  const setTopStep = (value) => {
    if (ytStep > value) {
      setytStepState(value);
    }
  };
  const [thumbnail, setThumbnail] = useState();
  const [title, setTitle] = useState("Title");
  const [desc, setDesc] = useState("Description");
  const [uploadProgress, setProgress] = useState(1);
  const [file, setFile] = useState(null);

  const [fileError, setError] = useState(false);
  const [alertMessage, setMessage] = useState("");

  const [visibility, setvisibility] = useState("public");
  const [videoUploaded, setVideoUploaded] = useState(false);
  useEffect(() => {
    socket.on("youtube-progress", (progress) => {});
  });
  useEffect(() => {
    nextHandler();
  }, [videoUploaded]);

  const nextHandler = () => {
    if (ytStep == 0 && videoUploaded) {
      setytStep(1);
    }
    if (ytStep == 1) {
      if (title.length < 1) {
        setMessage("Please enter a title before continuing.");
        setError(true);
        return (
          <Alert
            content="Somethign went wrong"
            setAlert={() => {
              setError(true);
            }}
          />
        );
      }
      if (!file) {
        setMessage("Please select thumbnail before continuing.");
        setError(true);
        return (
          <Alert
            content="Somethign went wrong"
            setAlert={() => {
              setError(true);
            }}
          />
        );
      }
      setytStep(2);
    } else if (ytStep === 2) {
      setytStep(3);
    } else if (ytStep === 3) {
      uploadimage();
    }
  };

  const onChangeHandler = (event) => {
    try {
      if (event.target.files[0]) {
        setThumbnail(event.target.files[0]);
        var reader = new FileReader();
        var url = reader.readAsDataURL(event.target.files[0]);
        reader.onloadend = function (e) {
          setFile([reader.result]);
        };
      }
    } catch (error) {
      console.log("onChangeHandler error", error);
    }
  };

  const uploadimage = () => {
    let formData = new FormData();
    sessionStorage.setItem("videoTitle", title);
    formData.append("file", thumbnail);
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("visibility", visibility);
    axios
      .post("/api/thumbnail-upload", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          vid: sessionStorage.getItem("vid"),
        },
        onUploadProgress: function (progressEvent) {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      })
      .then((res) => {
        dispatch(setUplaodProgress(66.3));
        dispatch(setVideoStep(4));
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleClick = (event) => {
    document.getElementById("file").click();
  };

  const handleVisibilitychange = (event) => {
    setvisibility(event.target.value);
  };

  return (
    <div className="upload-overlay">
      <div className="showCase-box">
        <div className="showcase-top">
          <div className="showCase-head">
            <h4>Youtube video upload</h4>
            <div className="showCase-head-right">
              <button
                onClick={() => {
                  dispatch(setVideoStep(1));
                  dispatch(setUplaodProgress(20));
                }}
                className="showCase-close"
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div className="showCase-steps">
            <div
              onClick={() => {
                setVideoUploaded(false);
                setTopStep(0);
              }}
              className={`step ${ytStep >= 0 ? "completed" : null}`}
            >
              <span>0</span>
              <p>Select video</p>
              <div className="step-bar completed"></div>
            </div>
            <div
              onClick={() => {
                setTopStep(1);
              }}
              className={`step ${ytStep >= 1 ? "completed" : null}`}
            >
              <span>1</span>
              <p>Details</p>
              <div className="step-bar completed"></div>
            </div>
            <div
              onClick={() => {
                setTopStep(2);
              }}
              className={`step ${ytStep >= 2 ? "completed" : null}`}
            >
              <span>2</span>
              <p>Video elements</p>
              <div className="step-bar "></div>
            </div>
            <div
              onClick={() => {
                setTopStep(3);
              }}
              className={`step ${ytStep >= 3 ? "completed" : null}`}
            >
              <span>3</span>
              <p>Visibility</p>
              <div className="step-bar "></div>
            </div>
          </div>
        </div>

        <div className="showcaseContent-wrap">
          <div className="row ">
            <div className="col-12 justify-self-center">
              {ytStep == 0 ? (
                <DragDropVideo
                  videoUploaded={(val) => {
                    setVideoUploaded(val);
                  }}
                />
              ) : null}
              {ytStep == 1 ? (
                <div className="grid-box">
                  <label>Title</label>
                  <form>
                    <div className="form-group">
                      <input
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                        }}
                        className="form-control"
                        placeholder="Tell viewers about your video"
                      ></input>
                    </div>
                  </form>

                  <div className="grid-box">
                    <label>Thumbnail</label>
                    <p>
                      Select or upload a picture that shows what’s in your
                      video. A good thumbnail stands out and draws viewer's
                      attention. <a href="#">Learn more</a>
                    </p>
                    <div className="thumbnails-row">
                      <div onClick={handleClick} className="upload-thumbnail">
                        <span>
                          <i
                            className="fa fa-cloud-upload"
                            aria-hidden="true"
                          ></i>
                          <input
                            onChange={onChangeHandler}
                            id="file"
                            accept="image/*"
                            className="file invisible"
                            type="file"
                            name="file"
                          />
                          Upload thumbnail
                        </span>
                      </div>
                      <div className="thumbnail-box">
                        {file ? <img src={file} alt="thumbnail" /> : null}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {ytStep == 2 ? (
                <div className="grid-box">
                  <h4>Description</h4>
                  <form>
                    <div className="form-group">
                      <textarea
                        value={desc}
                        onChange={(e) => {
                          setDesc(e.target.value);
                        }}
                        className="form-control"
                        placeholder="Tell viewers about your video"
                      ></textarea>
                    </div>
                  </form>
                </div>
              ) : null}
              {ytStep == 3 ? (
                <div className="grid-box">
                  <label>Select visibility</label>

                  <div className="container">
                    <div className="row mt-5">
                      <div className="col-sm-12">
                        <form>
                          <div className="custom-control custom-radio">
                            <label>
                              <input
                                type="radio"
                                name="visibility"
                                value="public"
                                checked={visibility === "public"}
                                onChange={handleVisibilitychange}
                                className="form-check-input"
                              />
                              Public
                            </label>
                          </div>

                          <div className="custom-control custom-radio">
                            <label>
                              <input
                                type="radio"
                                name="visibility"
                                value="private"
                                checked={visibility === "private"}
                                onChange={handleVisibilitychange}
                                className="form-check-input"
                              />
                              Private
                            </label>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="showCase-footer">
          <div className="showCase-progress">
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <span>{uploadProgress}% done</span>
          </div>
          <button onClick={nextHandler} className="btn btn-primary next-btn">
            NEXT
          </button>
        </div>
        {fileError ? (
          <Alert
            heading="Whoops!"
            content={alertMessage}
            setAlert={() => {
              setError(false);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default YoutubeModal;
