import React, { useState, useEffect, useRef } from "react";
import Avatar from "../../assets/images/avatar.svg";

import GalleryIcon from "../../assets/images/img-icon.svg";

import EmojiIcon from "../../assets/images/emoji-icon.svg";

import "./index.css";
import axios from "axios";
import Alert from "../shared/Alert";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

import { socket } from "../helpers/socket";
import { useHistory } from "react-router-dom";
import PostLocation from "./PostLocation";
// import { SkynetClient } from "skynet-js";

function PostUpload(props) {
  const history = useHistory();
  // const location = useLocation();
  const [post, setPost] = useState("");
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState("");
  const [type, setType] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [linkdin, setLinkedin] = useState({});
  // const [facebook, setFacebook] = useState({});
  // const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMessage, setShowMessage] = useState("uploading to sia network");
  // const [overview, setShowoverview] = useState("");
  // const { zoom } = location.state.state;
  // const { plateform, setPlateform } = useState({
  //   type: "page",
  //   name: "",
  //   id: "",
  //   selected: false,
  // });
  const [selectedPage, setSelectedPage] = useState([]);

  const wrapperRef = useRef(null);
  // const toggle = () => {
  //   setDropdownOpen(!dropdownOpen);
  // };

  const handleClickOutSideEmojo = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      showEmojis && setShowEmojis(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutSideEmojo, false);
    return () => {
      document.removeEventListener("click", handleClickOutSideEmojo, false);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetch("/api/linkedin/get-info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const { linkedin } = data;
        setLinkedin(linkedin);
      })
      .catch((error) => {
        console.log("something went wrong", error);
      });
  }, []);

  const LinkedinPost = async (e) => {
    if (post.length < 1 && !preview.length) {
      // should select media or text or both
      return;
    }
    let formData = new FormData();
    formData.append("post", post);
    formData.append("uploadTo", JSON.stringify(selectedPage));
    formData.append("target", target);
    // const client = new SkynetClient();

    // NOTE: This example is different from the other SDKs because we cannot just
    // take a path to a local file.

    // async function uploadExample() {
    //   try {
    //     const skylink = await client.uploadFile(file);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    if (file) {
      formData.append("myFile", file);
      // create a client
    }
    setLoader(true);
    socket.on("message", function (data) {
      if (data && data.upload === true) {
        setShowMessage("Uploading to linkedin platoform");
      }
    });
    let token = window.localStorage.getItem("token");
    formData.append("description", post);
    axios
      .post(`/api/linkedin/post-video?post=${post}`, formData, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        const { success, userPosts, organization } = res.data;
        if (success) {
          setError(true);
          // setErrorMsg("post upload to the page");
          setPost("");
          setPreview("");
          setLoader(false);
          history.push("/linkedin/post-upload/collaborator", {
            userPosts,
            organization,
            success,
          });
        } else {
          setError(true);
          setErrorMsg("something went wrong");
        }
        console.log("res", res);
        // const { success, msg, FB_DOC } = res.data;
        // if (success) {
        //   setError(true);
        //   setErrorMsg(msg);
        //   setPost("");
        //   setPreview("");
        // } else {
        //   setError(true);
        //   setErrorMsg(msg);
        // }
        // history.push("/facebook/post-upload/collaborator", {
        //   success,
        //   FB_DOC,
        //   facebook: true,
        // });
        // setLoader(false);
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  };

  // const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  // function ZoomVideo() {
  //   const [recordings, setRecordings] = useState([]);
  //   const [loading, setLoading] = useState(true);

  //   // TODO! move this to util function
  //   const getRecordings = (access_token) => {
  //     fetch("/api/zoom/get-recordings?access_token=" + access_token, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: localStorage.getItem("token"),
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         const {
  //           body: { meetings },
  //         } = data;

  //         const _meetings = meetings.map((meeting) => {
  //           return meeting.recording_files.filter((record) => {
  //             return record.file_type == "MP4";
  //           })[0];
  //         });
  //         setLoading(false);
  //         setRecordings(_meetings);
  //         console.log("_meetings", _meetings);
  //       })
  //       .catch((error) => {
  //         console.log("something went wrong", error);
  //       });
  //   };
  //   const downloadFile = async (url) => {
  //     setLoading(true);
  //     const zoomSession = sessionStorage.getItem("zoom");
  //     const { exp, token } = JSON.parse(zoomSession);
  //     const diffs = moment().diff(exp, "minutes");
  //     if (diffs > -4) {
  //       return;
  //     }

  //     fetch(
  //       `/api/zoom/download-recording?access_token=${token}&download_url=${url}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           authorization: localStorage.getItem("token"),
  //         },
  //       }
  //     ).then(async (data) => {
  //       const videofile = await new Blob([await data.arrayBuffer()]);

  //       const _file_link = URL.createObjectURL(videofile);
  //       console.log("_file_link", _file_link);
  //       setPreview(_file_link);
  //       setFile(videofile);
  //       setShow(false);
  //       setType("video");
  //     });
  //   };
  //   const refreshAccessToken = async () => {
  //     await fetch("/api/zoom/zoom-access-token", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: localStorage.getItem("token"),
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         const access_token = data.data.access_token;
  //         if (access_token) {
  //           sessionStorage.setItem(
  //             "zoom",
  //             JSON.stringify({
  //               token: access_token,
  //               exp: moment().add(1, "hours"),
  //             })
  //           );
  //           getRecordings(access_token);
  //         }
  //       });
  //   };
  //   useEffect(() => {
  //     const zoomRecordHandler = async () => {
  //       if (show) {
  //         let zoomSession = sessionStorage.getItem("zoom");
  //         if (!zoomSession) {
  //           await refreshAccessToken();
  //           zoomSession = await sessionStorage.getItem("zoom");
  //         }
  //         const { exp, token } = JSON.parse(zoomSession);

  //         if (exp) {
  //           const diffs = moment().diff(exp, "minutes");
  //           if (diffs > -2) {
  //             // refresh access token
  //             refreshAccessToken();
  //           } else {
  //             getRecordings(token);
  //           }
  //         }
  //       }
  //     };
  //     zoomRecordHandler();
  //   }, [show]);
  //   return (
  //     <>
  //       {zoom ? (
  //         <button className="block_btn" onClick={handleShow}>
  //           {/* <img src={ZoomImg} /> */}
  //           <span style={{ color: "#0099cd", fontSize: "22px" }}>zoom</span>
  //         </button>
  //       ) : null}

  //       {zoom ? (
  //         <Modal className="zoom_modal" show={show} onHide={handleClose}>
  //           <Modal.Header closeButton>
  //             <Modal.Title>Zoom recordings </Modal.Title>
  //           </Modal.Header>
  //           <Modal.Body>
  //             {loading ? (
  //               <div className="tweet-loader">
  //                 <div className="content-loader">
  //                   <img
  //                     alt="content-loader"
  //                     src={require("~/assets/images/content-loader.svg")}
  //                   />
  //                 </div>
  //               </div>
  //             ) : null}
  //             <div className="recording_title">
  //               <h6 className="mb-3">Recording Start</h6>
  //               <h6 className="mb-3">Recording End</h6>
  //             </div>
  //             <form
  //               onSubmit={submitHandler}
  //               method="post"
  //               enctype="multipart/form-data"
  //             >
  //               {recordings.map((item) => {
  //                 return (
  //                   <>
  //                     <div className="file-upload-zoom mb-3 d-flex align-items-center">
  //                       <div className="file_choosen">
  //                         {/* <input type="file" name="filename" /> */}
  //                         <label>
  //                           {moment(item.recording_start).format(
  //                             "MMM DD, YYYY, h:mm a"
  //                           )}
  //                         </label>
  //                         -{" "}
  //                         <label>
  //                           {moment(item.recording_end).format(
  //                             "MMM DD, YYYY, h:mm a"
  //                           )}
  //                         </label>
  //                       </div>

  //                       <input
  //                         type="button"
  //                         value="Select"
  //                         className="btn btn-primary"
  //                         onClick={() => downloadFile(item.download_url)}
  //                       />
  //                     </div>
  //                   </>
  //                 );
  //               })}
  //             </form>
  //           </Modal.Body>
  //           <Modal.Footer>
  //             <Button variant="primary" onClick={handleClose}>
  //               cancel
  //             </Button>
  //           </Modal.Footer>
  //         </Modal>
  //       ) : null}
  //     </>
  //   );
  // }

  function readURL(e) {
    setPreview(URL.createObjectURL(e.target.files[0]));
    const { type } = e.target.files[0];
    setType(type.split("/")[0]);
    setFile(e.target.files[0]);
  }

  const [next, setNext] = useState(false);
  const [target, setTarget] = useState("");
  const handleSelection = (selected) => {
    const { id, target } = selected;
    setNext(true);
    setTarget(target);
    if (target === "pages") {
      linkdin.pages.forEach((item, index) => {
        if (item.organaization_id === id) {
          setSelectedPage(item);
        }
      });
    }
    // else {
    //   if (target === "groups") {
    //     facebook.groups.forEach((item, index) => {
    //       if (item.organaization_id == id) {
    //         setSelectedPage(item);
    //       }
    //     });
    //   }
    // }
  };
  if (!next)
    return (
      <PostLocation
        pages={linkdin.pages}
        // groups={facebook.groups}
        onChange={handleSelection}
      />
    );
  const submitHandler = (e) => e.preventDefault();
  return (
    <div className="tweet-popup">
      {loader ? (
        <div className="tweet-loader">
          <div className="content-loader">
            <img
              alt="content-loader"
              src={require("~/assets/images/content-loader.svg")}
            />
            <br />
            <span style={{ color: "#5bc3b2" }}>
              {showMessage.length ? showMessage : null}
            </span>
          </div>
        </div>
      ) : null}
      {/* {overview ? <UploadOverView /> : null} */}
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
          <div className="profile-info">
            <div className="post-avatar">
              <img src={Avatar} alt="avatar" />
            </div>
            <div className="pi-right">
              <h2>
                {selectedPage && selectedPage?.organaization_name?.length > 0
                  ? selectedPage.organaization_name
                  : "linkedin page"}
              </h2>
            </div>
          </div>
          <div className="fb-post-pop-head">
            <form onSubmit={submitHandler}>
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
          <div className={` ${!preview ? "d-none" : ""}`}>
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

              <form encType="multipart/form-data" action="">
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
                {/* <li><img src={GifIcon} /></li> */}
                <li>
                  <img
                    onClick={() => {
                      document.getElementById("myFile").click();
                    }}
                    src={GalleryIcon}
                    alt="icon"
                  />
                </li>
                {/* {zoom ? (
                  <li>
                    <ZoomVideo />
                  </li>
                ) : null} */}

                <li
                  ref={wrapperRef}
                  onClick={() => {
                    setShowEmojis(!showEmojis);
                  }}
                >
                  <img src={EmojiIcon} alt="icon" />
                </li>
                {showEmojis ? (
                  <Picker
                    onSelect={(emo) => {
                      setShowEmojis(!showEmojis);
                      setPost(post + " " + emo.native);
                    }}
                  />
                ) : null}
              </ul>
            </div>
            <div className="col-5">
              <div className="tweetFtr-right">
                <button
                  onClick={(e) => {
                    LinkedinPost(e);
                  }}
                  className="tweet-btn"
                >
                  post
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
