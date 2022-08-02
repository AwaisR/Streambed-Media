import React from "react";
import moment from "moment";
const Youtubeicon = require("../../assets/images/youtube-icon.svg");
function CurrentStreamItem({
  title,
  videoId,
  checked,
  plateform,
  thumbnails,
  singleCheck,
  publishedAt,
  name,
  role,
}) {
  return (
    <div className="content-stream-videos youtube-stream">
      <div className="d-flex align-items-center">
        <div className="d-flex mr-4">
          <label className="checkmark-parent position-relative">
            <input
              value={videoId}
              type="checkbox"
              id={videoId}
              checked={checked}
              onChange={singleCheck}
            />
            <span className="checkmark"></span>
          </label>
        </div>
        <div className="content-select mr-2">
          <div className="content-video">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://streambedmedia.com/content-stag?v_id=${videoId}`}
              className="video"
            >
              <img src={`${thumbnails.high.url}`} alt="thumbler" />

              <i className="fa fa-play" aria-hidden="true"></i>
            </a>
          </div>
        </div>
        <div>
          <div className="video-detail">
            <h6 className="video-title">{title}</h6>

            <div className="d-flex justify-content-between align-items-center">
              <h6 className="video-time mb-0">
                {moment(publishedAt).format("MMMM Do YYYY, h:mm:ss a")}
              </h6>
              <img className="icon-video" src={Youtubeicon} alt="youtube" />
            </div>
          </div>
        </div>
      </div>
      <div className="videocard-footer row no-gutters">
        <div className="col-5 d-flex align-content-center">
          <i className="fa fa-tag" aria-hidden="true"></i>
          <span>{role ? role : "Publisher"}</span>
        </div>
        <div className="col-7 d-flex justify-content-between">
          <div className="d-flex d-flex align-items-center pl-2 pl-lg-3 pr-2">
            {name ? <i className="fa fa-star-o" aria-hidden="true"></i> : ""}
            <span>{name ? "@" + name : ""}</span>
          </div>
          <div className="add_col">
            <button>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentStreamItem;
