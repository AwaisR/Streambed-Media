import React, { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { setVideoStep, setUplaodProgress } from "../../actions";
import Alert from "../shared/Alert";
import { useHistory } from "react-router-dom";
import twitterApi from "../../helpers/TwitterApi";

function PlateForm() {
  const dispatch = useDispatch();
  // const plateforms = useSelector((state) => state.videoupload.plateform);
  const [agree, setAgree] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [twitterTokens, setTwitterTokens] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [plateform, setPlateForm] = useState("");
  const [facebook, setFacebook] = useState(null);
  const [zoom, setZoom] = useState(false);
  const [instagram, setInstagram] = useState(null);
  const [linkedin, setLinkedin] = useState(null);
  const [privateVideo, setPrivateVideo] = useState(false);
  useEffect(() => {
    twitterApi.getTokens().then((message) => {
      setTwitterTokens(message);
    });
  }, []);

  const [hasRT, setHasRT] = useState("");
  const token = window.localStorage.getItem("token");
  const history = useHistory();

  // const twitterTokenExists = twitterTokens && twitterTokens.isActive;
  useEffect(() => {
    fetch("/users/getrT", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        const { rT, facebook, zoom, zoomIsActive, instagram, linkedin } = res;
        setHasRT(rT);
        setFacebook(facebook);
        setZoom(zoomIsActive);
        setInstagram(instagram);
        setLinkedin(linkedin);
      });
  }, []);

  const redirectToLink = () => {
    sessionStorage.setItem("steps", "1");
    history.push("/settings/link");
  };
  const plateformClickHandler = (e) => {
    switch (e.currentTarget.value) {
      case "youtube":
        if (!hasRT) {
          setRedirect(true);
          setErrorMsg("You must link your youtube channel first");
          setShowAlert(true);
          return;
        }
        setPlateForm(e.currentTarget.value.toLowerCase());
        break;
      case "twitter":
        if (!twitterTokens?.isActive) {
          setRedirect(true);
          setErrorMsg("You must link your twitter account first");
          setShowAlert(true);
          return;
        }
        setPlateForm(e.currentTarget.value.toLowerCase());

        break;
      case "facebook":
        if (!facebook?.access_token) {
          setRedirect(true);
          setErrorMsg("You must link your facebook page first");
          setShowAlert(true);
          return;
        }
        setPlateForm(e.currentTarget.value.toLowerCase());
        break;
      case "instagram":
        if (!instagram.access_token) {
          setRedirect(true);
          setErrorMsg("You must link your facebook page first");
          setShowAlert(true);
          return;
        }
        setPlateForm(e.currentTarget.value.toLowerCase());
      case "linkedin":
        if (!linkedin.access_token) {
          setRedirect(true);
          setErrorMsg("You must link your facebook page first");
          setShowAlert(true);
          return;
        }
        setPlateForm(e.currentTarget.value.toLowerCase());
        break;
      case "tiktok":
        break;
      default:
        break;
    }
  };
  const nextHandler = () => {
    if (
      !hasRT &&
      !twitterTokens?.isActive &&
      !facebook?.access_token &&
      !instagram?.access_token &&
      !linkedin?.access_token
    ) {
      setErrorMsg("you must link your account first");
      setShowAlert(true);
      setRedirect(true);
      return;
    }

    if (plateform.length < 3) {
      setErrorMsg("you must select plateform first");
      setShowAlert(true);
      return;
    }

    if (plateform === "youtube") {
      dispatch(setVideoStep(3));
      dispatch(setUplaodProgress(20));
      return;
    } else if (plateform === "twitter") {
      history.push("/twitter/post-upload");
    } else if (plateform === "facebook") {
      history.push("/facebook/post-upload", { state: { zoom: zoom } });
    } else if (plateform === "linkedin") {
      history.push("/linkedin/post-upload", { state: { zoom: zoom } });
    }
  };
  const handleVideoMagnify = () => {
    setPrivateVideo(!privateVideo);
  };
  useEffect(() => {
    sessionStorage.setItem("magnifyVideo", privateVideo);
  }, [privateVideo]);
  const handleAlert = (val) => {
    setShowAlert(val);
    if (redirect) {
      setRedirect(false);
      redirectToLink();
    }
  };
  const backHandler = () => {
    dispatch(setVideoStep(1));
  };

  return (
    <div id="video-upload-success" className="platform-content">
      <div className="select-platform">
        {!hasRT &&
        !twitterTokens?.isActive &&
        !facebook?.access_token &&
        !instagram?.access_token &&
        !linkedin?.access_token ? (
          <div>
            <h4>Please select Plateform to publish on</h4>
            <a
              onClick={redirectToLink}
              href="#"
              className="btn btn-primary mx-auto"
            >
              Browse
            </a>
          </div>
        ) : (
          <div className="platform-row">
            {hasRT ? (
              <button
                data-value="youtube"
                value="youtube"
                className="platForm position-relative"
                onClick={plateformClickHandler}
              >
                <img src={require("../../assets/images/youtube-icon.svg")} />

                {plateform === "youtube" ? (
                  <i className="fa fa-check-circle" aria-hidden="true"></i>
                ) : null}
              </button>
            ) : null}

            {facebook?.access_token ? (
              <button
                data-value="facebook"
                value="facebook"
                className="platForm position-relative"
                onClick={plateformClickHandler}
              >
                <img
                  style={{ width: "25px" }}
                  alt="facebook-icon"
                  className={twitterTokens?.isActive ? "selected" : ""}
                  src={require("../../assets/images/icons/fb.png")}
                />
                {plateform === "facebook" && (
                  <i className="fa fa-check-circle" aria-hidden="true"></i>
                )}
              </button>
            ) : null}
            {linkedin?.access_token ? (
              <button
                data-value="linkedin"
                value="linkedin"
                className="platForm position-relative"
                onClick={plateformClickHandler}
              >
                <img
                  style={{ width: "25px" }}
                  alt="facebook-icon"
                  className={twitterTokens?.isActive ? "selected" : ""}
                  src={require("../../assets/images/icons/linkedin.png")}
                />
                {plateform === "linkedin" && (
                  <i className="fa fa-check-circle" aria-hidden="true"></i>
                )}
              </button>
            ) : null}
          </div>
        )}
      </div>

      <div className="disclaimer">
        <small>
          Disclaimer: I agree that when I publish content to third party
          platforms (for example, YouTube and Twitter). I must abide by the
          terms of use of those platforms, including all terms relating to
          copyright and other intellectual property rights. I understand that
          Streambed’s terms of use do not replace or supersede the terms of use
          of those platforms.{" "}
          <a
            target="_blank"
            href="https://streambedmedia.com/terms"
            rel="noopener noreferrer"
          >
            Read more
          </a>
          .
        </small>
        <div className="form-group form-check">
          <input
            type="checkbox"
            id="disclaimer1"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          <label htmlFor="disclaimer1">
            I agree to disclaimer and wish to proceed
          </label>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="exampleCheck1"
              onChange={handleVideoMagnify}
            />
            <label class="form-check-label" for="exampleCheck1">
              Hide from Magnify App
            </label>
          </div>
        </div>
        <div className="row pt-4">
          <div className="col-6">
            <button onClick={backHandler} className="btn btn-primary">
              back
            </button>
          </div>
          <div className="col-6">
            <button
              disabled={!agree}
              onClick={nextHandler}
              className="btn btn-primary"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>

      {showAlert ? (
        <Alert
          content={errorMsg}
          setAlert={(v) => {
            handleAlert(v);
          }}
        />
      ) : null}
    </div>
  );
}

export default PlateForm;
