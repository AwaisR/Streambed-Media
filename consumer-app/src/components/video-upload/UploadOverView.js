import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetVideo } from "../../actions/index";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
function UploadOverView() {
  let history = useHistory();
  const dispatch = useDispatch();
  const videoupload = useSelector((state) => state.videoupload);
  const { collaborator } = videoupload;

  const handleUploadNew = () => {
    dispatch(resetVideo());
    history.push("/dashboard");
  };

  const goToIndexPage = () => {
    window.location.replace(
      `https://streambedmedia.com/content-stag?v_id=${sessionStorage.getItem(
        "videoid"
      )}`
    );
  };
  const goToSiaUrl = () => {
    window.location.replace(`https://siasky.net/${videoupload?.sia_url}`);
  };
  return (
    <div className="overview-wrap">
      <h4>Upload Overview</h4>
      <div className="overview-box">
        <ul>
          <li>
            <label>Title</label>
            <span>{sessionStorage.getItem("videoTitle")}</span>
          </li>
          <li>
            <label>Upload Date</label>
            <span>{moment().format("MMMM Do YYYY")}</span>
          </li>
          <li>
            <label>Collaborators</label>
            <div className="collaborators-right">
              {collaborator.map((item) => {
                return (
                  <span key={uuidv4()}>
                    <span>{item.role} -&nbsp;</span>
                    <span>{item.user}</span>
                  </span>
                );
              })}
            </div>
          </li>
          <li>
            <label>
              Platforms
              <small>Click icon to view post in new tab</small>
            </label>
            <span>
              <a
                href={`https://www.youtube.com/watch?v=${sessionStorage.getItem(
                  "videoid"
                )}`}
                className="platForm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt="fa circle"
                  src={require("../../assets/images/youtube-icon.svg")}
                />
                <i className="fa fa-check-circle" aria-hidden="true"></i>
              </a>
            </span>
          </li>
          <li>
            <label>OIP Transaction ID</label>
            <span onClick={goToIndexPage} className="flo-hash-key">
              <span>{videoupload?.txid?.substring(0, 45)}...</span>
            </span>
          </li>
          <li>
            <label>Sia Storage ID</label>
            <span onClick={goToSiaUrl} className="flo-hash-key">
              <span>
                {`${videoupload?.sia_url}`.substring(0, 45)}
                ...
              </span>
            </span>
          </li>
        </ul>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <button
            onClick={handleUploadNew}
            className="btn btn-primary upload-new"
          >
            Back to Dashboard
          </button>
        </div>
        <div className="col-sm-6">
          <button
            onClick={goToIndexPage}
            className="btn btn-primary upload-new"
          >
            Go to indexing page
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadOverView;
