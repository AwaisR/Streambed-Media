import React from "react";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";
import "./InstagramStreamItem.css";
import PostCard from "./PostCard";
import { useHistory } from "react-router-dom";

import { Popover, PopoverHeader, PopoverBody } from "reactstrap";
let InstaIcon = require("../../../assets/images/instagram-icon.svg");
let fbIcon = require("../../../assets/images/icons/fb.png");
function InstagramStreamItem(props) {
  const {
    // videoId,
    // checked,
    // plateform,
    // singleCheck,
    publishedAt,
    title,
    thumbnails,
    id,
    name,
    role,
    show,
    setShow,
    index,
    media_url,
    media_type,
    permalink,
    indexed,
    txid,
    target,
  } = props;
  const [modalShow, setModalShow] = React.useState(false);
  const history = useHistory();
  const redirectToPost = (link) => {
    window.location.href = link;
  };
  return (
    <div className="content-stream-videos instagram-stream ">
      <div className="d-flex align-items-center">
        <div className="d-flex mr-4">
          <label className="checkmark-parent position-relative">
            <input
              value="{videoId}"
              type="checkbox"
              id="{videoId}"
              checked={true}
            />
            <span className="checkmark"></span>
          </label>
        </div>
        <div className="content-select mr-2">
          <div className="content-video">
            <a target="_blank" rel="noopener noreferrer" className="video">
              <img alt="thumbnails" src={thumbnails} />
            </a>
          </div>
        </div>
        <div className="video-detail">
          <h6 className="video-title">{title}</h6>

          <div className="d-flex justify-content-between align-items-center">
            <h6 className="video-time mb-0">
              {moment(publishedAt).format("MMMM Do YYYY, h:mm:ss a")}
            </h6>
            <img
              className="icon-video icon-video-link"
              src={target === "facebook" ? fbIcon : InstaIcon}
              alt="instagram icon"
              onClick={() => redirectToPost(permalink)}
            />
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
            <button onClick={() => setModalShow(true)} id={"insta-" + id}>
              +
            </button>
          </div>
        </div>
      </div>
      <InstagramPopup
        {...props}
        show={modalShow}
        onHide={() => setModalShow(false)}
        icon={target === "facebook" ? fbIcon : InstaIcon}
      />
    </div>
  );
}

function InstagramPopup(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="card_popup_wrap"
    >
      <Modal.Body>
        <PostCard hide={props.onHide} {...props} />{" "}
      </Modal.Body>
    </Modal>
  );
}

export default InstagramStreamItem;
