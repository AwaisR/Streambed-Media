import React, { useState, useEffect } from "react";
import CurrentStreamItem from "./CurrentStreamItem";
import { setYoutubeData } from "../../actions/index.js";
import "./stream.css";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { setPlateform } from "../../../src/actions/dashboard";

import { updateVideoCollaboratorsStatistics } from "../../actions/dashboard";
import ContentTwitterStream from "./ContentTwitterStream";
import PostCard from "./instagram/PostCard";
import Alert from "../shared/Alert";
import InstagramStreamItem from "./instagram/InstagramStreamItem";
import LinkedinStreamItem from "./linkedin/LinkedinStreamItem";

const ContentStream = (props) => {
  const plateForm = useSelector((state) => state.dashboard.plateForm);
  const dispatch = useDispatch();

  const ytUpdate = useSelector((store) => store.youtube.refresh);
  const ytVideo = useSelector((store) => store.youtube.video);
  const videoCollaboratorsStatistics = useSelector(
    (store) => store.dashboard.videoCollaboratorsStatistics
  );
  const user = useSelector((store) => store.user.user);

  const youtubeVideo = useSelector((store) => store.dashboard.youtubeVideo);

  const [youtubeVideoList, setYoutubeVideList] = useState([]);
  const [youtubeVideoFilterd, setYVFilter] = useState([]);

  const [ytCollaboratorsVideoList, setYTCollVideoList] = useState([]);
  const [ytCollaboratorsVideoListFilter, setYTCollVideoListFilter] = useState(
    []
  );

  const [dropFilter, setDropFilter] = useState(false);
  const [checkedAll, setCheckedAll] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hasRT, setHasRT] = useState("");
  const [loadingRT, setLoadingRT] = useState(true);

  const [instagramPost, setInstagramPosts] = useState([]);
  const [indexedPosts, setIndexPosts] = useState([]);

  const [facebookPost, setFacebookPosts] = useState([]);
  const [linkedinPost, setLinkedinPost] = useState([]);
  const [fbIndexedPosts, setFBIndexPosts] = useState([]);
  const [facebookToken, setFacebookToken] = useState(null);
  const [instagramToken, setInstagramToken] = useState(null);
  const [twitterToken, setTwitterToken] = useState(null);
  const [linkdin, setLinkdin] = useState(null);
  const token = window.localStorage.getItem("token");
  useEffect(() => {
    const posts_id =
      indexedPosts &&
      indexedPosts.map((item) => {
        return item.post_id;
      });

    const _instagram_posts =
      instagramPost &&
      instagramPost.map((post) => {
        if (posts_id.includes(post.id)) {
          const index = indexedPosts.findIndex(
            (item) => item.post_id == post.id
          );

          post.indexed = true;
          post.txid = indexedPosts[index].txid;
        } else {
          post.indexed = false;
        }
        return post;
      });
    setInstagramPosts(_instagram_posts);
  }, [indexedPosts]);
  useEffect(() => {
    const fbPosts =
      fbIndexedPosts &&
      fbIndexedPosts.map((item) => {
        return item.post_id;
      });

    const FBPOSTS =
      facebookPost &&
      facebookPost.map((post) => {
        let index = fbPosts.indexOf(post.id);
        if (index != -1) {
          post.indexed = true;
          post.txid = fbIndexedPosts[index].txid;
        } else {
          post.indexed = false;
        }
        return post;
      });

    setFacebookPosts(FBPOSTS);
  }, [fbIndexedPosts]);
  useEffect(() => {
    fetch("/users/getrT", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((message) => {
        const {
          rT,
          facebook,
          zoom,
          zoomIsActive,
          instagram,
          linkedin,
        } = message;
        setFacebookToken(facebook);
        setInstagramToken(instagram);
        setLinkdin(linkedin);
        setHasRT(rT);
        setLoadingRT(false);
      });
  }, []);

  useEffect(() => {
    if (plateForm.toLowerCase() === "instagram") {
      getInstagramPosts();
    }

    if (plateForm.toLowerCase() == "facebook") {
      getFacebookPosts();
    }
    if (plateForm.toLowerCase() == "linkedin") {
      getLinkedPosts();
    }
  }, [plateForm]);
  const getFacebookPosts = () => {
    setLoading(true);
    fetch("/api/facebook/get-posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((posts) => {
        setLoading(false);
        const filtered = setFacebookPosts(posts.data);
        setFBIndexPosts(posts.facebook);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const getLinkedPosts = () => {
    setLoading(true);
    fetch("/api/linkedin/get-posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((posts) => {
        const filtered = posts.posts.filter((item) => {
          return item.media_type === "image";
        });
        setLoading(false);
        setLinkedinPost(filtered);
        // setFBIndexPosts(posts.facebook);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getInstagramPosts = () => {
    setLoading(true);
    fetch("/api/instagram/get-posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((posts) => {
        setLoading(false);
        setInstagramPosts(posts.data);
        setIndexPosts(posts.indexPosts);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const setYoutubeVideFilter = (items) => {
    dispatch(setYoutubeData(items));
    setYVFilter(items);
  };

  const singleCheck = (e) => {
    const items = [...youtubeVideoFilterd];
    items.forEach((item) => {
      if (e.target.value === item.videoId) {
        item.checked = !item.checked;
      }
      if (!item.checked) {
        setCheckedAll(false);
      }
    });

    setYoutubeVideFilter(items);
  };
  const singleColCheck = (e) => {
    const items = [...ytCollaboratorsVideoList];
    const videoList = [...videoCollaboratorsStatistics];
    videoList.forEach((item) => {
      if (e.target.value == item.id) {
        item.selected = !item.selected;
      }
    });
    dispatch(updateVideoCollaboratorsStatistics(videoList));
    items.forEach((item) => {
      if (e.target.value === item.videoId) {
        item.checked = !item.checked;
      }
    });
    setYTCollVideoList(items);
  };
  useEffect(() => {
    setYoutubeVideFilter(youtubeVideoList);
  }, [youtubeVideoList]);

  useEffect(() => {
    setYTCollVideoListFilter(ytCollaboratorsVideoList);
  }, [ytCollaboratorsVideoList]);

  const checkAll = () => {
    const items = [...youtubeVideoFilterd];
    items.forEach((item) => {
      if (checkedAll) {
        item.checked = false;
      } else {
        item.checked = true;
      }
    });

    const videoList = [...videoCollaboratorsStatistics];
    videoList.forEach((item) => {
      if (checkedAll) {
        item.selected = false;
      } else {
        item.selected = true;
      }
    });
    dispatch(updateVideoCollaboratorsStatistics(videoList));
    setYoutubeVideFilter(items);
    setCheckedAll(!checkedAll);
  };
  const _filter = ({ target }) => {
    const temp = youtubeVideoList.filter((item) =>
      item.title.toLowerCase().includes(target.value.toLowerCase())
    );
    setYoutubeVideFilter(temp);

    const collTemp = ytCollaboratorsVideoList.filter((item) =>
      item.title.toLowerCase().includes(target.value.toLowerCase())
    );
    setYTCollVideoListFilter(collTemp);
  };

  useEffect(() => {
    let tempVideoList = [];
    if (!ytVideo.length && youtubeVideo) {
      youtubeVideo.forEach((item, i) => {
        let obj = {};
        obj.plateform = "YouTube";
        obj.thumbnails = item.snippet.thumbnails;
        obj.title = item.snippet.title;
        obj.videoId = item.snippet.resourceId.videoId;
        obj.checked = true;
        obj.publishedAt = item.snippet.publishedAt;

        tempVideoList.push(obj);
      });
    } else if (ytVideo.length && youtubeVideo) {
      // show video/statistics as users has selected before going to another component/page
      ytVideo.forEach((item, i) => {
        let obj = item;
        obj.checked = item.checked;
        tempVideoList.push(obj);
      });
    }

    setLoading(false);

    setYoutubeVideList(tempVideoList);
  }, [youtubeVideo]);

  useEffect(() => {
    let tempVideoList = [];
    if (videoCollaboratorsStatistics.length > 0) {
      videoCollaboratorsStatistics.forEach((item, i) => {
        let obj = {};
        obj.plateform = "YouTube";
        obj.thumbnails = item.snippet.thumbnails;
        obj.title = item.snippet.title;
        obj.videoId = item.snippet.videoID;
        obj.checked = item.selected;
        obj.publishedAt = item.snippet.publishedAt;
        obj.publisherName = item.publisherName;
        obj.publisherRole = item.publisherRole;

        tempVideoList.push(obj);
      });
      setYTCollVideoList(tempVideoList);
    }
  }, [videoCollaboratorsStatistics]);

  const handlePlateFormChange = (plateform) => {
    dispatch(setPlateform(plateform));
  };
  useEffect(() => {
    if (hasRT) {
      dispatch(setPlateform("youtube"));
    } else if (twitterToken?.oauth_token) {
      dispatch(setPlateform("twitter"));
    } else if (instagramToken?.access_token) {
      dispatch(setPlateform("instagram"));
    } else if (facebookToken?.access_token) {
      dispatch(setPlateform("facebook"));
    } else if (linkdin?.access_token) {
      dispatch(setPlateform("linkedin"));
    }
  }, [loadingRT]);
  const NoContent = () => {
    return (
      <div className="youtue-not-linked">
        Upload content to see the content stream
      </div>
    );
  };
  const renderYoutubeContent = () => {
    return (
      <>
        <div className="new-check d-flex px-lg-3 justify-content-between flex-wrap">
          <div className="select-all d-flex">
            <div className="mr-3">
              <label className="checkmark-parent position-relative">
                <input
                  type="checkbox"
                  id="selectAll"
                  onChange={() => checkAll()}
                  checked={checkedAll}
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="content-select">
              <label>Select All</label>
            </div>
          </div>
          <div className="filter-group">
            <input
              placeholder="Filter content"
              className="filter-textbox"
              type="text"
              onChange={_filter}
            />
          </div>
        </div>
        <div className="overview-root pl-lg-2 flexcroll ">
          {youtubeVideoFilterd.map((item) => {
            return (
              <CurrentStreamItem
                key={item.videoId}
                title={item.title}
                videoId={item.videoId}
                checked={item.checked}
                singleCheck={singleCheck}
                plateform={item.plateform}
                thumbnails={item.thumbnails}
                publishedAt={item.publishedAt}
              />
            );
          })}

          <div
            style={{
              backgroundColor: " #ececec",
              padding: "10px 5px 50px 5px",
              marginTop: "12px",
            }}
          >
            {ytCollaboratorsVideoListFilter.map((item) => {
              return (
                <CurrentStreamItem
                  key={item.videoId}
                  title={item.title}
                  videoId={item.videoId}
                  checked={item.checked}
                  singleCheck={singleColCheck}
                  plateform={item.plateform}
                  thumbnails={item.thumbnails}
                  publishedAt={item.publishedAt}
                  name={item.publisherName}
                  role={item.publisherRole}
                />
              );
            })}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="height-content">
      <div className="filter-dropdown">
        <h4 className="d-none d-sm-block">Filter</h4>
        <div className="custom-dropdown">
          <ButtonDropdown
            disabled={false}
            isOpen={dropFilter}
            toggle={(e) => setDropFilter(!dropFilter)}
          >
            <DropdownToggle caret>
              {plateForm.length > 0 ? plateForm : "Select Platform Filters"}
            </DropdownToggle>
            <DropdownMenu>
              {hasRT && (
                <DropdownItem onClick={() => handlePlateFormChange("youtube")}>
                  <div className="select-all d-flex">
                    <div className="mr-3">
                      <label className="checkmark-parent position-relative">
                        <input
                          type="checkbox"
                          id="youtube"
                          name="youtube"
                          onChange={() => {}}
                          checked={plateForm == "youtube"}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="content-select">
                      <img
                        alt="content-loader"
                        src={require("../../assets/images/youtube-icon.svg")}
                      />
                      <label>Youtube</label>
                    </div>
                  </div>
                </DropdownItem>
              )}
              {twitterToken?.oauth_token ? (
                <DropdownItem onClick={() => handlePlateFormChange("twitter")}>
                  <div className="select-all d-flex">
                    <div className="mr-3">
                      <label className="checkmark-parent position-relative">
                        <input
                          type="checkbox"
                          id="twitter"
                          onChange={() => {}}
                          checked={plateForm.toLowerCase() == "twitter"}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="content-select">
                      <img
                        alt="twitter"
                        src={require("../../assets/images/twitter-icon.svg")}
                      />
                      <label>Twitter</label>
                    </div>
                  </div>
                </DropdownItem>
              ) : null}
              {instagramToken?.access_token ? (
                <DropdownItem
                  onClick={() => {
                    getInstagramPosts();
                    handlePlateFormChange("instagram");
                  }}
                >
                  <div className="select-all d-flex">
                    <div className="mr-3">
                      <label className="checkmark-parent position-relative">
                        <input
                          type="checkbox"
                          id="instagram"
                          onChange={() => {}}
                          checked={plateForm.toLowerCase() == "instagram"}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="content-select">
                      <img
                        alt="instagram"
                        src={require("../../assets/images/instagram-icon.svg")}
                      />
                      <label>Instagram</label>
                    </div>
                  </div>
                </DropdownItem>
              ) : null}
              {facebookToken?.access_token ? (
                <DropdownItem
                  onClick={() => {
                    getFacebookPosts();
                    handlePlateFormChange("facebook");
                  }}
                >
                  <div className="select-all d-flex">
                    <div className="mr-3">
                      <label className="checkmark-parent position-relative">
                        <input
                          type="checkbox"
                          id="facebook"
                          name="facebook"
                          onChange={() => {}}
                          checked={plateForm == "facebook"}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="content-select">
                      <img
                        alt="content-loader"
                        src={require("../../assets/images/icons/icons8-facebook.svg")}
                      />
                      <label>Facebook</label>
                    </div>
                  </div>
                </DropdownItem>
              ) : null}
              {linkdin?.access_token ? (
                <DropdownItem
                  onClick={() => {
                    getLinkedPosts();
                    handlePlateFormChange("linkedin");
                  }}
                >
                  <div className="select-all d-flex">
                    <div className="mr-3">
                      <label className="checkmark-parent position-relative">
                        <input
                          type="checkbox"
                          id="linkedin"
                          name="linkedin"
                          onChange={() => {}}
                          checked={plateForm == "linkedin"}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="content-select">
                      <img
                        alt="content-loader"
                        src={require("../../assets/images/linkedin.svg")}
                      />
                      <label>LinkedIn</label>
                    </div>
                  </div>
                </DropdownItem>
              ) : null}
            </DropdownMenu>
          </ButtonDropdown>
        </div>
      </div>

      {loadingRT || loading ? (
        <div className="content-loader">
          <img
            src={require("~/assets/images/content-loader.svg")}
            alt="content-loader"
          />
        </div>
      ) : plateForm == "youtube" && !loadingRT && hasRT ? (
        renderYoutubeContent()
      ) : plateForm == "twitter" && !loading ? (
        <ContentTwitterStream />
      ) : plateForm == "instagram" && !loading ? (
        <div className="overview-root pl-2-5 flexcroll">
          {instagramPost &&
            instagramPost.map((el, i) => (
              <InstagramStreamItem
                key={"insta-" + i}
                role="publisher"
                id={el.id}
                index={i}
                title={el.caption}
                thumbnails={el.thumbnail_url || el.media_url}
                name={el.username}
                media_url={el.media_url}
                media_type={el.media_type}
                publishedAt={el.timestamp}
                permalink={el.permalink}
                indexed={el.indexed}
                txid={el.txid}
                target="instagram"
              />
            ))}
        </div>
      ) : plateForm == "linkedin" && !loading ? (
        <div className="overview-root pl-2-5 flexcroll">
          <div>
            {linkedinPost &&
              linkedinPost.map((el, i) => (
                <LinkedinStreamItem
                  key={"linkedin-" + i}
                  role="publisher"
                  id={el._id}
                  index={i}
                  title={el.message}
                  thumbnails={el.post_url ? el.post_url : null}
                  name={el.username}
                  media_type={el.media_type}
                  publishedAt={el.createdAt}
                  permalink={el.organaization && el.organaization}
                  target="linkedin"
                  // singleCheck={singlecolCheck}
                />
              ))}

            {linkedinPost &&
              linkedinPost.map((el, i) => {
                return (
                  el.collaborators &&
                  el.collaborators.map((col, y) => {
                    if (col.verified === true) {
                      return (
                        <>
                          <div
                            style={{
                              backgroundColor: " #ececec",
                              padding: "10px 5px 5px 5px",
                              marginTop: "12px",
                            }}
                          >
                            <LinkedinStreamItem
                              key={"linkedin-" + i}
                              role={col.role}
                              id={el._id}
                              index={i}
                              title={el.message}
                              thumbnails={el.post_url ? el.post_url : null}
                              name={col.user}
                              media_type={el.media_type}
                              publishedAt={el.createdAt}
                              permalink={el.organaization && el.organaization}
                              target="linkedin"
                              // singleCheck={singlecolCheck}
                            />
                          </div>
                        </>
                      );
                    }
                  })
                );
              })}
          </div>
        </div>
      ) : (
        <NoContent />
      )}
    </div>
  );
};

export default ContentStream;
