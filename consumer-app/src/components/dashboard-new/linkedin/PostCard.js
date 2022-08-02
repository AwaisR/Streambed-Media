import React, { useState, useEffect } from "react";
import axios from "axios";
import "./post-card.css";

import { useHistory } from "react-router-dom";
import Collaborator from "../../instagram-upload/Collaborator";
import moment from "moment";
function PostCard(props) {
  const {
    publishedAt,
    title,
    thumbnails,
    id,
    name,
    role,
    show,
    hide,
    setShow,
    index,
    media_url,
    media_type,
    permalink,
    indexed,
    txid,
    target,
    icon,
  } = props;
  const [post, setPost] = useState({});
  const [loader, setLoader] = useState(false);
  let history = useHistory();
  const redirectToPost = (link) => {
    window.location.href = link;
  };
  const sendContent = () => {
    let url = "";
    let redirect = "";
    if (target === "instagram") {
      url = "/api/instagram/add-index";
      redirect = "/instagram/add-post-coll";
    } else if (target === "facebook") {
      url = "/api/facebook/add-index";
      redirect = "/facebook/post-upload/collaborator";
    }

    setLoader(true);
    axios({
      method: "post",
      url: url,
      headers: {
        "content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      data: {
        user: {
          id: id,
          media_type: media_type,
          media_url: media_url,
          username: name | "",
          timestamp: publishedAt || "",
          title: title || "",
          permalink,
        },
      },
    })
      .then((res) => {
        setPost(res.data);
        setLoader(false);

        if (target === "facebook") {
          history.push(
            `${redirect}?vid=${res.data.vid}&permalink=${permalink}`,
            {
              success: true,
              FB_DOC: { vid: res.data.vid, _id: res.data._id },
              facebook: true,
            }
          );
        } else {
          history.push(
            `${redirect}?vid=${res.data.vid}&permalink=${permalink}`
          );
        }
      })
      .catch((err) => console.log("something went wrong", err));
  };

  return (
    <div className="instagram_box">
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
      <div className="d-flex justify-content-between mb-2 ">
        <h4>Content Options</h4>
        <i onClick={hide} className="fa fa-times" aria-hidden="true"></i>
      </div>
      <div className="instagram_row">
        <div className="instagram_img">
          <img src={thumbnails} />
        </div>
        <div className="instagram_detail">
          <p>{title}</p>
          <div className="date_row">
            <span>{moment(publishedAt).format("MMMM Do YYYY")}</span>
            <div className="instagram_icon">
              <img alt="icon instagram" src={icon} />
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        {indexed === true ? (
          <>
            <div
              onClick={() =>
                redirectToPost(
                  `https://streambedmedia.com/content-stag?${
                    target === "instagram" ? "insta_post" : "facebook_post"
                  }=${id}&txid=${txid}`
                )
              }
              className="instagram_shadow_box"
            >
              <img
                alt="index-icon"
                src={require("../../../assets/images/icon1.png")}
              />
              index page
            </div>
            <div
              className="instagram_shadow_box"
              onClick={() => redirectToPost(permalink)}
            >
              <img alt="icon2" src={icon} />
              view on {target}{" "}
            </div>
          </>
        ) : (
          <div
            className="instagram_shadow_box add_box"
            onClick={() => sendContent()}
          >
            <span className="plus">+</span>
            Generate index page{" "}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCard;
