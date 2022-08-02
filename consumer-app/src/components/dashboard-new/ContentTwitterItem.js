import React from "react";
import moment from "moment";
const no_media = require("../../assets/images/no_media.png");
const twitterIcon = require("../../assets/images/twitter-icon.svg");

function ContentTwitterItem(props) {
  const {
    user,
    text,
    id_str,
    created_at,
    entities: { media },
  } = props.item;
  return (
    <div
      key={created_at}
      id={created_at}
      className="content-stream-videos twitter-stream"
    >
      <a href={`https://twitter.com/${user.screen_name}/status/${id_str}`}>
        <div className="d-flex align-items-center">
          {" "}
          <div className="d-flex mr-4">
            <label className="checkmark-parent position-relative">
              <input
                value={id_str}
                type="checkbox"
                id={id_str}
                checked={"checked"}
                onChange={() => console.log("singleCheck")}
              />
              <span className="checkmark"></span>
            </label>
          </div>
          <div className="content-select mr-2">
            <div className="content-video">
              <p>
                {text.includes("https")
                  ? text.split("https")[0]
                  : text.length
                  ? text
                  : "-"}
              </p>
              <p className="postCount">
                {text ? text.split("https")[0].length : 0}/280
              </p>
            </div>
          </div>
          <div className="video-detail">
            <div className="twitter-detail">
              <span
                target="_blank"
                href={`https://twitter.com/${user.screen_name}/status/${id_str}`}
                className="video-twitter"
              >
                <div className="twitter-thumb">
                  {media.length ? (
                    <>
                      <img
                        src={`${media.length ? media[0]?.media_url : no_media}`}
                      />
                    </>
                  ) : (
                    <span>No Media</span>
                  )}
                </div>
                <span>
                  {props.item.mimeType?.split("/")[0] == "video"
                    ? props.item.videoDuration
                      ? props.item.videoDuration + "s"
                      : "00:00:00"
                    : ""}
                </span>
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="video-time mb-0">
                {moment(created_at).format("MMM HH:mm:ss ")}
              </h6>
              <img className="icon-video" src={twitterIcon} alt="twitter" />
            </div>
          </div>
        </div>
        <div className="videocard-footer row no-gutters">
          <div className="col-5 d-flex align-content-center">
            <i className="fa fa-tag" aria-hidden="true"></i>
            <span>{props.role ? props.role : "Publisher"}</span>
          </div>
          <div className="col-7 d-flex justify-content-between">
            <div className="d-flex d-flex align-items-center pl-2 pl-lg-3 pr-2">
              {props.owner ? (
                <i className="fa fa-star-o" aria-hidden="true"></i>
              ) : null}
              <span>
                {props.owner ? "@" + props.item.user.screen_name : ""}
              </span>
            </div>
            <div className="add_col">
              <button>+</button>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export default ContentTwitterItem;
