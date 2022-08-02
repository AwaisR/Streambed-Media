import React, { useEffect, useMemo, useState } from "react";
import { styled } from "twin.macro";
import axios from "axios";

import Select from "../../components/forms/Select";
import { Card, CardContent } from "../../components/layouts/Card";
import ContentStreamLoading from "./content/ContentStreamLoading";

import SearchIcon from "../../components/icons/SearchIcon";
import PlusCircleIcon from "../../components/icons/PlusCircleIcon";
import MinusCircleIcon from "../../components/icons/MinusCircleIcon";

import MainContent from "./shared/MainContent";
import PageTitle from "./shared/PageTitle";
import ActionButton from "./shared/ActionButton";
import ContentStreamSidebar from "./shared/ContentStreamSidebar";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import runTheContent from "../.././components/helpers/GetToken";
import { setYoutubeData, setContentStream } from "../../actions/index";
import { setYoutubeOwnVideo } from "../../actions/dashboard";
import MyModal from "./profile/MsgDisplayModel";
const filterOptions = {
  "": "Filters",
  youtube: "YouTube",
  twitter: "Twitter",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "Linkedin",
};

const ContentCardTitle = styled.h5`
  --max-lines: 3;
  position: relative;
  max-height: calc(1.25rem * var(--max-lines));
  overflow: hidden;
  padding: 0;
  padding-right: 0.5rem;

  // &::before {
  //   position: absolute;
  //   content: "...";
  //   bottom: 0;
  //   right: 0;
  // }

  // &::after {
  //   content: "";
  //   position: absolute;
  //   right: 0;
  //   width: 1rem;
  //   height: 1rem;
  //   background: white;
  // }
`;

const ContentCard = ({
  data,
  addContentStreamVideo,
  contentStream,
  removeContentVideo,
}) => {
  const { platform, data: contentData } = data;
  let title, secondaryAction, createDate;
  const MetchedVideo =
    contentStream &&
    contentStream.some((item) => item.videoId === data.videoId);
  switch (platform) {
    case "Twitter":
      title = contentData.text.includes("https")
        ? contentData.text.split("https")[0]
        : contentData.text.length
        ? contentData.text
        : "-";
      createDate = data.data.createdAt;
      break;
    case "YouTube":
    default:
      title = data.title;
      createDate = data.publishedAt;
      break;
  }

  secondaryAction = useMemo(() => {
    let label, icon;
    if (platform === "YouTube") {
      if (MetchedVideo) {
        label = "Remove from content stream";
        icon = MinusCircleIcon;
      } else {
        label = "Add to content stream";
        icon = PlusCircleIcon;
      }
    }
    return { label, icon };
    // eslint-disable-next-line
  }, [contentStream]);

  const { icon: ActionIcon, label: actionLabel } = secondaryAction;
  const hanldeAddVideo = (e) => {
    if (MetchedVideo) {
      removeContentVideo(e);
    } else {
      addContentStreamVideo(e);
    }
    // }
    //
  };
  return (
    // <div className="flex items-stretch">
    <div className="w-full flex items-stretch space-x-3 cards-columns">
      <Card className="w-full relative h-full">
        <CardContent className="flex flex-col justify-between h-full">
          {title || createDate ? (
            <div className="w-full flex justify-between align-center">
              {/* <div
              className="w-full flex flex-col justify-between"
              style={{ minHeight: "8rem" }}
            > */}
              <ContentCardTitle className="mb-4 text-sm">
                {title}
              </ContentCardTitle>
              {/* <div className="flex justify-between items-center"> */}
              {/* {PLATFORM_ICON_MAP[platform]({ className: "w-6 h-6" })} */}
              <span className="text-xs text-gray-400 mb-2">
                {moment(createDate).format("ll")}
              </span>
            </div>
          ) : (
            ""
          )}

          {/* </div> */}
          {/* </div> */}
          <div className="w-full card-new-img">
            {platform === "YouTube" && data.thumbnails ? (
              <iframe
                width="100%"
                height="130"
                title="youtubeImage"
                src={`https://www.youtube.com/embed/${
                  data.videoId && data.videoId
                }`}
              ></iframe>
            ) : platform === "Twitter" && contentData.entities.media.length ? (
              <img
                src={contentData.entities.media[0].media_url}
                alt="Twitter media"
              />
            ) : (
              <div className="w-36 h-full bg-gray-300"></div>
            )}
          </div>
          {/* <div className="w-full space-y-2"> */}
          <div className="w-full space-y-2 flex space-x-2 mt-3">
            {actionLabel && (
              <ActionButton
                icon={<ActionIcon className="w-10 h-6" />}
                label={actionLabel}
                onClick={(e) => {
                  platform === "YouTube" && hanldeAddVideo(data);
                }}
                className="w-8/12"
              />
            )}
            <div className="view-social-block block w-4/12 mt-0">
              <ActionButton
                className="h-full"
                platform={platform}
                label="View"
                onClick={(e) => {
                  platform === "YouTube"
                    ? window.location.replace(
                        `https://www.youtube.com/watch?v=${data.videoId}`
                      )
                    : (window.location.href = `/content/${platform.toLowerCase()}`);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
const ContentCardMultiply = ({ data, platform }) => {
  let title, secondaryAction;

  switch (platform) {
    case "facebook":
      title = data.message ? data.message : "";
      break;
    case "linkedin":
      title = data.data.message;
      break;
    case "instagram":
      title = data.caption ? data.caption : "";
      break;
    default:
      title = data.data.message;
      break;
  }
  secondaryAction = useMemo(() => {
    let label, icon;

    if (data.inContentStream) {
      label = "Remove from content stream";
      icon = MinusCircleIcon;
    } else {
      label = "Add to content stream";
      icon = PlusCircleIcon;
    }

    return { label, icon };
  }, [data.inContentStream]);

  const { icon: ActionIcon, label: actionLabel } = secondaryAction;

  return (
    <div className="w-full flex items-stretch space-x-3 cards-columns">
      {platform === "instagram" ? (
        data.indexed ? (
          <>
            {/* <Card className="w-full relative h-full">
              <CardContent>
                <div className="flex space-x-4 h-full">
                  <div
                    className="w-full flex flex-col justify-between"
                    style={{ minHeight: "8rem" }}
                  >
                    <ContentCardTitle className="mb-4 text-sm">
                      {title}
                    </ContentCardTitle>
                    <div className="flex justify-between items-center">
                      {PLATFORM_ICON_MAP[
                        platform === "linkedin"
                          ? "Linkedin"
                          : platform === "facebook"
                          ? "Facebook"
                          : "Instagram"
                      ]({ className: "w-6 h-6" })}
                      <span className="text-xs text-gray-400">
                        {platform === "linkedin"
                          ? moment(data.data.createdAt).format("LLL")
                          : platform === "instagram"
                          ? moment(data.timestamp).format("LLL")
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="w-48">
                    {platform === "linkedin" ? (
                      data.data.post_url ? (
                        <img
                          src={data.data.post_url}
                          width="100%"
                          height="130"
                        />
                      ) : (
                        <div className="w-36 h-full bg-gray-300"></div>
                      )
                    ) : platform === "facebook" ? (
                      data.type === "video" ? (
                        <iframe
                          width="100%"
                          height="130"
                          src={data.source}
                        ></iframe>
                      ) : data.type === "photo" ? (
                        <img src={data.picture} width="100%" height="130" />
                      ) : platform === "instagram" ? (
                        data.media_type === "VIDEO" ? (
                          <iframe
                            width="100%"
                            height="130"
                            src={data.permalink}
                          ></iframe>
                        ) : (
                          <img src={data.permalink} width="100%" height="130" />
                        )
                      ) : (
                        ""
                      )
                    ) : data.media_type === "VIDEO" ? (
                      <iframe
                        width="100%"
                        height="130"
                        src={data.media_url}
                        title="my-frame"
                      ></iframe>
                    ) : (
                      <img src={data.media_url} width="100%" height="130" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="w-full space-y-2">
              <ActionButton
                icon={<ActionIcon className="w-10 h-6" />}
                label={actionLabel}
                onClick={(e) => {}}
                className="w-8/12"
              />
              <Link className="block w-4/12">
                <ActionButton
                  platform={
                    platform === "linkedin"
                      ? "Linkedin"
                      : platform === "facebook"
                      ? "Facebook"
                      : "Instagram"
                  }
                  label="View"
                  onClick={(e) => {
                    platform === "linkedin"
                      ? window.location.replace(
                          `https://www.linkedin.com/company/${data.data.organaization}/admin/`
                        )
                      : platform === "facebook"
                      ? window.location.replace(data.permalink_url)
                      : window.location.replace(data.permalink);
                  }}
                />
              </Link>
            </div> */}
            <Card className="w-full relative h-full">
              <CardContent className="flex flex-col justify-between h-full">
                {platform === "linkedin" ? (
                  data.data.createdAt
                ) : data.timestamp || title ? (
                  <div className="w-full flex justify-between align-center">
                    <ContentCardTitle className="mb-2 text-sm">
                      {title}
                    </ContentCardTitle>
                    {/* <span className="">12/12/12</span> */}
                    {/* {PLATFORM_ICON_MAP[
                  platform === "linkedin"
                    ? "Linkedin"
                    : platform === "facebook"
                    ? "Facebook"
                    : "Instagram"
                ]({ className: "w-6 h-6" })} */}
                    <span className="text-xs text-gray-400 mb-2">
                      {platform === "linkedin"
                        ? moment(data.data.createdAt).format("LLL")
                        : platform === "instagram"
                        ? moment(data.timestamp).format("LLL")
                        : ""}
                    </span>
                  </div>
                ) : (
                  ""
                )}

                {/* Image */}
                <div className="w-full card-new-img">
                  {platform === "linkedin" ? (
                    data.data.post_url ? (
                      <img
                        src={data.data.post_url}
                        width="100%"
                        height="130"
                        alt="linkedinImage"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300"></div>
                    )
                  ) : platform === "facebook" ? (
                    data.type === "video" ? (
                      <iframe
                        width="100%"
                        height="130"
                        src={data.source}
                        title="myframe"
                      ></iframe>
                    ) : data.type === "photo" ? (
                      <img
                        src={data.picture}
                        width="100%"
                        height="130"
                        alt="facebookImage"
                      />
                    ) : platform === "instagram" ? (
                      data.media_type === "VIDEO" ? (
                        <iframe
                          width="100%"
                          height="130"
                          src={data.permalink}
                          title="myframe"
                        ></iframe>
                      ) : (
                        <img
                          src={data.permalink}
                          width="100%"
                          height="130"
                          alt="instagramImage"
                        />
                      )
                    ) : (
                      ""
                    )
                  ) : data.media_type === "VIDEO" ? (
                    <iframe
                      width="100%"
                      height="130"
                      src={data.media_url}
                      title="myframe"
                    ></iframe>
                  ) : (
                    <img
                      src={data.media_url}
                      width="100%"
                      height="130"
                      alt="videoImage"
                    />
                  )}
                </div>

                <div className="w-full space-y-2 flex space-x-2 mt-3">
                  <ActionButton
                    icon={<ActionIcon className="w-10 h-6" />}
                    label={actionLabel}
                    onClick={(e) => {}}
                    className="w-8/12"
                  />
                  <div className="view-social-block block w-4/12 mt-0">
                    <ActionButton
                      className="h-full"
                      platform={
                        platform === "linkedin"
                          ? "Linkedin"
                          : platform === "facebook"
                          ? "Facebook"
                          : "Instagram"
                      }
                      label="View"
                      onClick={(e) => {
                        platform === "linkedin"
                          ? window.location.replace(
                              `https://www.linkedin.com/company/${data.data.organaization}/admin/`
                            )
                          : platform === "facebook"
                          ? window.location.replace(data.permalink_url)
                          : window.location.replace(data.permalink);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          ""
        )
      ) : (
        <>
          <Card className="w-full relative h-full">
            <CardContent className="flex flex-col justify-between h-full">
              {platform === "linkedin" ? (
                data.data.createdAt
              ) : data.timestamp || title ? (
                <div className="w-full flex justify-between align-center">
                  <ContentCardTitle className="mb-2 text-sm">
                    {title}
                  </ContentCardTitle>
                  {/* <span className="">12/12/12</span> */}
                  {/* {PLATFORM_ICON_MAP[
                  platform === "linkedin"
                    ? "Linkedin"
                    : platform === "facebook"
                    ? "Facebook"
                    : "Instagram"
                ]({ className: "w-6 h-6" })} */}
                  <span className="text-xs text-gray-400 mb-2">
                    {platform === "linkedin"
                      ? moment(data.data.createdAt).format("LLL")
                      : platform === "instagram"
                      ? moment(data.timestamp).format("LLL")
                      : ""}
                  </span>
                </div>
              ) : (
                ""
              )}
              {/* Image */}
              <div className="w-full card-new-img">
                {platform === "linkedin" ? (
                  data.data.post_url ? (
                    <img
                      src={data.data.post_url}
                      width="100%"
                      height="130"
                      alt="linkedinImage"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300"></div>
                  )
                ) : platform === "facebook" ? (
                  data.type === "video" ? (
                    <iframe
                      width="100%"
                      height="130"
                      title="facebookIframe"
                      src={data.source}
                    ></iframe>
                  ) : data.type === "photo" ? (
                    <img
                      src={data.picture}
                      width="100%"
                      height="130"
                      alt="facebookImage"
                    />
                  ) : platform === "instagram" ? (
                    data.media_type === "VIDEO" ? (
                      <iframe
                        width="100%"
                        height="130"
                        src={data.permalink}
                        title="instagramIframe"
                      ></iframe>
                    ) : (
                      <img
                        src={data.permalink}
                        width="100%"
                        height="130"
                        alt="instagrame"
                      />
                    )
                  ) : (
                    ""
                  )
                ) : data.media_type === "VIDEO" ? (
                  <iframe
                    width="100%"
                    height="130"
                    src={data.media_url}
                    title="video"
                  ></iframe>
                ) : (
                  <img
                    src={data.media_url}
                    width="100%"
                    height="130"
                    alt="mediaImage"
                  />
                )}
              </div>

              <div className="w-full space-y-2 flex space-x-2 mt-3">
                <ActionButton
                  icon={<ActionIcon className="w-10 h-6" />}
                  label={actionLabel}
                  onClick={(e) => {}}
                  className="w-8/12"
                />
                <div className="view-social-block block w-4/12 mt-0">
                  <ActionButton
                    className="h-full"
                    platform={
                      platform === "linkedin"
                        ? "Linkedin"
                        : platform === "facebook"
                        ? "Facebook"
                        : "Instagram"
                    }
                    label="View"
                    onClick={(e) => {
                      platform === "linkedin"
                        ? window.location.replace(
                            `https://www.linkedin.com/company/${data.data.organaization}/admin/`
                          )
                        : platform === "facebook"
                        ? window.location.replace(data.permalink_url)
                        : window.location.replace(data.permalink);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
const ContentStream = () => {
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState([]);
  const [copyContents, setCopyContents] = useState([]);
  const [youtubeContent, setYoutubeContent] = useState([]);
  const [copYoutubeContent, setCopYoutubeContent] = useState([]);
  const [twitterContent, setTwitterContent] = useState([]);
  const [copytwitterContent, setCopyTwitterContent] = useState([]);
  const [linkedinContent, setLinkedinContent] = useState([]);
  const [copyLinkedinContent, setCopyLinkedinContent] = useState([]);
  const [facebookPost, setFacebookPosts] = useState([]);
  const [copyFacebookPost, setCopyFacebookPost] = useState([]);
  const [fbIndexedPosts, setFBIndexPosts] = useState([]);
  const [instagramPost, setInstagramPosts] = useState([]);
  const [copyInstagramPost, setCopyInstagramPosts] = useState([]);
  const [indexedPosts, setIndexPosts] = useState([]);
  const [loader, setLoader] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // const [error, setError] = useState(false);
  const yt = useSelector((state) => state.dashboard.youtubeVideo);
  const youtubeVideo = useSelector((state) => state.youtube.video);
  const contentStream = useSelector((state) => state.youtube.contentVideos);
  const ytVideo = useSelector((state) => state.youtube);
  // const [youtubeVideoFilterd, setYVFilter] = useState([]);
  // const [checkedAll, setCheckedAll] = useState(false);
  // const [selectVideoAnalytics, setSelectVideoAnalytics] = useState([]);
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  const getLinkedPosts = () => {
    const token = localStorage.getItem("token");

    return fetch("/api/linkedin/get-posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        const { success, posts: _posts } = res;
        // const filtered = posts.posts.filter((item) => {
        //   return item.media_type === "image";
        // });
        const posts = _posts.map((data) => ({
          platform: "linkedin",
          _id: data._id,
          createdAt: new Date(data.createdAt).getTime(),
          data,
        }));
        if (success) {
          setLinkedinContent(posts);
          setCopyLinkedinContent(posts);
        }
        return posts;
      })
      .catch((err) => {
        console.log("error", err);
      });
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // abort
      return;
    }

    // a promise
    let action;
    switch (filter) {
      case "youtube":
        action = getYouTubeVidoes();
        break;
      case "twitter":
        action = getTwitterContent(token);
        break;
      case "linkedin":
        action = getLinkedPosts(token);
        break;
      case "facebook":
        action = getFacebookPosts(token);
        break;
      case "instagram":
        action = getInstagramPosts(token);
        break;
      default:
        action = fetchAllContent(token);
        break;
    }
    // getYouTubeVidoes(token);
    if (action) {
      setLoading(true);
      action.finally(() => {
        setLoading(false);
      });
    }
    // eslint-disable-next-line
  }, [filter]);
  const getFacebookPosts = (token) => {
    return fetch("/api/facebook/get-posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((posts) => {
        // const facebook = posts.facebook;
        //    console.log("posts",posts);
        //   const fbPosts =
        //   posts.facebook &&
        //   posts.facebook.map((item) => {
        //     return item.post_id;
        //   });
        //  console.log("fbPosts",fbPosts);
        //    const FBPOSTS =
        //    posts.data &&
        //        posts.data.map((post) => {
        //     let index = fbPosts.indexOf(post.id)
        //     let filter=fbPosts.filter((item)=>post.id===item)
        //     console.log("filter",filter);
        //      console.log("index",index);
        //     if (index != -1) {
        //       console.log("posts.facebook",posts.facebook[post.id]);
        //       // post.createdAt=posts.facebook[post.id].createdAt;
        //       post.indexed = true;
        //       post.platform="facebook";
        //       post.txid = posts.data[index].txid;
        //     } else {
        //       //  post.createdAt=posts.facebook[post.id].createdAt;
        //       post.indexed = false;
        //       post.platform="facebook";
        //       // post.createdAt=post.facebook.createdAt;
        //     }
        //     return post;
        //   });
        //   console.log("FBPOSTS",FBPOSTS);

        //  console.lsog("fbposts",FBPOSTS);
        // setLoading(false);
        setFacebookPosts(posts.data);
        setCopyFacebookPost(posts.data);
        setFBIndexPosts(posts.facebook);
        const Fbposts = posts.data.map((item) => ({
          ...item,
          platform: "facebook",
        }));
        return Fbposts;
      })
      .catch((err) => {
        console.log("errrrrr", err);
        setLoading(false);
      });
  };
  const getContentData = () => {
    const token = localStorage.getItem("token");
    return fetch("/content/get-content-stream", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((posts) => {
        dispatch(setContentStream(posts.data));
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const getInstagramPosts = (token) => {
    return fetch("/api/instagram/get-posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((posts) => {
        const Instaposts = posts.data.map((item) => ({
          ...item,
          platform: "instagram",
        }));
        setLoading(false);
        setCopyInstagramPosts(posts.data);
        setInstagramPosts(posts.data);
        setIndexPosts(posts.indexPosts);
        return Instaposts;
      })
      .catch((err) => {
        setLoading(false);
      });
  };
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
            (item) => item.post_id === post.id
          );

          post.indexed = true;
          post.txid = indexedPosts[index].txid;
        } else {
          post.indexed = false;
        }
        return post;
      });
    setInstagramPosts(_instagram_posts);
    // eslint-disable-next-line
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
        if (index !== -1) {
          post.indexed = true;
          post.txid = fbIndexedPosts[index].txid;
        } else {
          post.indexed = false;
        }
        return post;
      });
    setFacebookPosts(FBPOSTS);
    // eslint-disable-next-line
  }, [fbIndexedPosts]);
  const addContentStreamVideo = (item) => {
    const { videoId, title, publishedAt, platform } = item;
    fetch("/content/add-content-stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify({
        videoId: videoId,
        title: title,
        publisherDate: publishedAt,
        platform,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        getContentData();
      });
    // const videos = [...contentStreamVideos];
    // const filterVideo = videos.findIndex((vid) => vid.videoId === item.videoId);
    // if (filterVideo === -1) {
    //   videos.push(item);
    //   youtubeContent.forEach((vid) => {
    //     if (vid.videoId === item.videoId) {
    //       return (vid.inContentStream = true);
    //     }
    //   });

    //   setContentStreamVideos(videos);
    // } else {
    //   const filter = videos.filter((vid) => vid.videoId !== item.videoId);
    //   youtubeContent.forEach((vid) => {
    //     if (vid.videoId === item.videoId) {
    //       return (vid.inContentStream = false);
    //     }
    //   });
    //   setContentStreamVideos(filter);
    // }
  };
  const removeContentVideo = (item) => {
    const { videoId } = item;
    const token = localStorage.getItem("token");
    fetch("/content/remove-content-stream", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify({
        videoId: videoId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        getContentData();
        console.log("data", data);
      });
  };
  const RenderContent = () => {
    switch (filter) {
      case "youtube":
        return (
          <div className="grid grid-cols-3 gap-4 w-full space-y-3 plate-form-content">
            {youtubeContent.length
              ? youtubeContent.map((content, i) => (
                  <ContentCard
                    key={i}
                    data={content}
                    addContentStreamVideo={addContentStreamVideo}
                    contentStream={contentStream}
                    removeContentVideo={removeContentVideo}
                  />
                ))
              : "No posts available"}
          </div>
        );
      case "twitter":
        return (
          <div className="grid grid-cols-3 gap-4 w-full space-y-3 plate-form-content">
            {twitterContent.length
              ? twitterContent.map((content) => (
                  <ContentCard key={content._id} data={content} />
                ))
              : "No posts available"}
          </div>
        );
      case "linkedin":
        return (
          <div className="grid grid-cols-3 gap-4 w-full space-y-3 plate-form-content">
            {linkedinContent.length
              ? linkedinContent.map((content, i) => (
                  <ContentCardMultiply
                    key={i}
                    data={content}
                    platform="linkedin"
                  />
                ))
              : "No posts available"}
          </div>
        );
      case "facebook":
        return (
          <div className="grid grid-cols-3 gap-4 w-full space-y-3 plate-form-content">
            {facebookPost
              ? facebookPost.map((content, i) => (
                  <ContentCardMultiply
                    key={i}
                    data={content}
                    platform="facebook"
                  />
                ))
              : "No posts available"}
          </div>
        );
      case "instagram":
        return (
          <div className="grid grid-cols-3 gap-4 w-full space-y-3 plate-form-content">
            {instagramPost.length
              ? instagramPost.map((content, i) => (
                  <ContentCardMultiply
                    key={i}
                    data={content}
                    platform="instagram"
                  />
                ))
              : "No posts available"}
          </div>
        );
      case "":
        return (
          <>
            {typeof contents[0] === "undefined" ? (
              loader ? (
                <ContentStreamLoading />
              ) : (
                "No posts available"
              )
            ) : (
              <div className="grid grid-cols-3 gap-4 w-full space-y-3 plate-form-content">
                {contents.map((content, i) =>
                  typeof content === "undefined" ? (
                    ""
                  ) : content.platform === "linkedin" ||
                    content.platform === "instagram" ||
                    content.platform === "facebook" ? (
                    <ContentCardMultiply
                      key={i}
                      data={content}
                      platform={content.platform}
                    />
                  ) : (
                    <ContentCard key={i} data={content} />
                  )
                )}
              </div>
            )}
          </>
        );
      default:
        break;
    }
  };
  const getYouTubeVidoes = () => {
    // const videos=array.forEach(element => {

    // });
    // setYoutubeContent(youtubeVideo);
    // return fetch(`/api/youtube-videos`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `${token}`,
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (data.success) {
    //       const videos = data.videos.map((data) => ({
    //         platform: "YouTube",
    //         _id: data.videoId,
    //         createdAt: new Date(data.publishedAt).getTime(),
    //         data,
    //       }));
    //       videos.sort((a, b) => b.createdAt - a.createdAt);
    //       setYoutubeContent(videos);
    //       setCopYoutubeContent(videos);
    //       return videos;
    //     } else {
    //       console.log("error", data.message);
    //     }
    //   });
    let tempVideoList = [];
    youtubeVideo.forEach((item, i) => {
      let obj = {};
      obj.platform = "YouTube";
      obj.thumbnails = item.snippet.thumbnails;
      obj.title = item.snippet.title;
      obj.inContentStream = false;
      obj.videoId = item.snippet.resourceId.videoId;
      obj.checked = false;
      obj.publishedAt = item.snippet.publishedAt;
      obj.snippet = item.snippet;

      tempVideoList.push(obj);
    });

    setCopYoutubeContent(tempVideoList);
    setYoutubeContent(tempVideoList);
  };
  const getTwitterContent = async (token) => {
    const handleError = (error) => {
      if (error.response) {
        // The request was made and the server responded with a status
        console.log(error.response);
      } else if (error.request) {
        // The request was made but no response was received

        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log("Something went wrong", error.config);
    };

    let Dbtweets = [];
    let tweets = [];
    let collaboratorTweets = [];
    let tweets_id = [];
    try {
      const result = await axios.get("/api/twitter/get-user-post", {
        headers: {
          Authorization: token,
        },
      });

      Dbtweets = result.data._posts || [];
      Dbtweets &&
        Dbtweets.forEach((element) => {
          tweets_id.push(element.id_str);
        });
      ///get post from the Twitter plateform///
      let resp = await axios.post(
        "/api/twitter/get-tweetsMultiplyId",
        { tweet_id: tweets_id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      let twitterData = resp.data.result;
      ///get the twitter id which is return from the twitter ///
      for (const data of twitterData) {
        Dbtweets.forEach((element) => {
          if (element.id_str === data.id_str) {
            return tweets.push(element);
          }
        });
      }
    } catch (error) {
      handleError(error);
    }
    try {
      const result = await axios.get("/api/twitter/get-collaborators", {
        headers: {
          Authorization: token,
        },
      });

      collaboratorTweets = (result.data.collaborators || []).map(
        (item) => item.post
      );
    } catch (error) {
      handleError(error);
    }

    const content = tweets
      .concat(collaboratorTweets)
      // maps twitter data to unified structure
      .map((data) => ({
        platform: "Twitter",
        _id: data.id_str,
        createdAt: new Date(data.created_at).getTime(),
        data,
      }));
    content.sort((a, b) => b.createdAt - a.createdAt);
    setCopyTwitterContent(content);
    setTwitterContent(content);

    return content;
  };

  const fetchAllContent = async (token) => {
    const parallel = await Promise.all([
      getTwitterContent(token),
      getLinkedPosts(token),
      getFacebookPosts(token),
      getInstagramPosts(token),
    ]);
    const allContent = parallel.flat(1);
    allContent.sort((a, b) => b.createdAt - a.createdAt);
    setLoader(false);
    setCopyContents(allContent);
    setContents(allContent);
  };
  ////////////////anylatics posts ///////////
  const getVideoList = () => {
    runTheContent((accessToken) => {
      if (!accessToken || accessToken === "undefined") return;

      fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true&maxResults=50&type=video&key=${
          process.env.REACT_APP_APIKEY
        }&_=${Math.random()}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setIsOpen(true);
            setErrorMsg(
              "It seems youtube quota for the day is over.some of the youtube features might not work properly"
            );
          } else {
            if (data.items) {
              const info =
                data.items[0].contentDetails.relatedPlaylists.uploads;
              fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${info}&key=${process.env.REACT_APP_APIKEY}`,
                {
                  method: "GET",
                  headers: {
                    "Content-type": "application/json",
                    Authorization: "Bearer " + accessToken,
                  },
                }
              )
                .then((response) => response.json())
                .then((data) => {
                  dispatch(setYoutubeData(data.items));
                  dispatch(setYoutubeOwnVideo(data.items));

                  // TODO set state
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            } else {
              setIsOpen(true);
              // setError(true);
              setErrorMsg(
                "it seems you don't have youtube channel.please Create one"
              );
            }
          }
        });
    });
  };
  useEffect(() => {
    getVideoList();
    getContentData();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    let tempVideoList = [];
    if (!yt.length && youtubeVideo) {
      youtubeVideo.forEach((item, i) => {
        let obj = {};
        obj.plateform = "YouTube";
        obj.thumbnails = item.snippet.thumbnails;
        obj.title = item.snippet.title;
        obj.videoId = item.snippet.resourceId.videoId;
        obj.checked = false;
        obj.publishedAt = item.snippet.publishedAt;
        obj.snippet = item.snippet;

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
    // setYoutubeVideFilter(tempVideoList);
    // eslint-disable-next-line
  }, [youtubeVideo]);
  // const setYoutubeVideFilter = (items) => {
  //   setYVFilter(items);
  // };
  const checkAll = (e) => {
    const { checked } = e.target;
    console.log("checked", checked);
    fetch("/content/update-all-content-stream", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify({
        checked,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) getContentData();
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const singleCheck = (e) => {
    const { checked, value } = e.target;
    fetch("/content/update-content-stream", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify({
        videoId: value,
        checked,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) getContentData();
      });
  };
  // useEffect(() => {
  //   dispatch(setContentStream(selectVideoAnalytics));
  //   // eslint-disable-next-line
  // }, [selectVideoAnalytics]);
  const handleSearch = (e) => {
    const searchValues = e.target.value;
    switch (filter) {
      case "facebook":
        if (searchValues === "") {
          setFacebookPosts(copyFacebookPost);
        }
        const data = copyFacebookPost.filter((item) => {
          return item.message
            ? item.message.toLowerCase().indexOf(searchValues.toLowerCase()) >=
                0
            : null;
        });
        setFacebookPosts(data);
        break;
      case "youtube":
        if (searchValues === "") {
          setYoutubeContent(copYoutubeContent);
        }
        const Youdata = copYoutubeContent.filter((item) => {
          return item.title
            ? item.title.toLowerCase().indexOf(searchValues.toLowerCase()) >= 0
            : null;
        });
        setYoutubeContent(Youdata);
        break;
      case "instagram":
        if (searchValues === "") {
          setInstagramPosts(copyInstagramPost);
        }
        const Instadata = copyInstagramPost.filter((item) => {
          return item.caption
            ? item.caption.toLowerCase().indexOf(searchValues.toLowerCase()) >=
                0
            : null;
        });
        setInstagramPosts(Instadata);
        break;
      case "linkedin":
        if (searchValues === "") {
          setLinkedinContent(copyLinkedinContent);
        }
        const LinkedInadata = copyLinkedinContent.filter((item) => {
          return item.data
            ? item.data.message
                .toLowerCase()
                .indexOf(searchValues.toLowerCase()) >= 0
            : null;
        });
        setLinkedinContent(LinkedInadata);
        break;
      case "twitter":
        if (searchValues === "") {
          setTwitterContent(copytwitterContent);
        }
        const TwitterContentsSearch = copytwitterContent.filter((item) => {
          return item.data
            ? item.data.text
                .split("https")[0]
                .toLowerCase()
                .indexOf(searchValues.toLowerCase()) >= 0
            : null;
        });
        setTwitterContent(TwitterContentsSearch);
        break;
      default:
        let dataFacebook = copyContents.filter((item) => {
          return item.message && item.message
            ? item.message.toLowerCase().indexOf(searchValues.toLowerCase()) >=
                0
            : null;
        });
        let dataYoutube = copyContents.filter((item) => {
          return item.data
            ? item.data.title &&
                item.data.title
                  .toLowerCase()
                  .indexOf(searchValues.toLowerCase()) >= 0
            : null;
        });
        const LinkedInSearchData = copyContents.filter((item) => {
          return item.data
            ? item.data.message &&
                item.data.message
                  .toLowerCase()
                  .indexOf(searchValues.toLowerCase()) >= 0
            : null;
        });
        const TwitterSearch = copyContents.filter((item) => {
          return item.data && item.data
            ? item.data.text &&
                item.data.text
                  .split("https")[0]
                  .toLowerCase()
                  .indexOf(searchValues.toLowerCase()) >= 0
            : null;
        });
        if (searchValues === "") {
          setContents(copyContents);
        } else {
          if (dataFacebook.length) setContents(dataFacebook);
          else if (dataYoutube.length) setContents(dataYoutube);
          else if (LinkedInSearchData.length) setContents(LinkedInSearchData);
          else if (TwitterSearch.length) setContents(TwitterSearch);
        }
        break;
    }
  };
  const closeModal = () => {
    setIsOpen(false);
    setErrorMsg("");
  };
  return (
    <div className="flex w-full">
      {isOpen && (
        <MyModal
          isOpen={isOpen}
          title="Collaborators Error"
          closeModal={closeModal}
          description={errorMsg}
        />
      )}
      <MainContent className="w-full lg:w-8/12 xl:w-9/12">
        <PageTitle>Content</PageTitle>
        <Card className="mt-6 bg-white data-content">
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="relative w-3/5 flex items-center">
                <SearchIcon className="absolute left-3" />
                <input
                  type="search"
                  className="w-full border-gray-200 border-2 text-copy text-sm pl-8 pr-3 py-1 rounded-xl placeholder-gray-300 cursor-default focus:outline-none focus:border-primary"
                  placeholder="Search"
                  onChange={handleSearch}
                />
              </div>
              <div className="w-1/5">
                <Select
                  placeholder="Filters"
                  name="filters"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  options={filterOptions}
                />
              </div>
            </div>

            <hr className="my-4" />
            {loading ? <ContentStreamLoading /> : RenderContent()}
          </CardContent>
        </Card>
      </MainContent>

      <div className="hidden lg:block lg:w-4/12 xl:w-3/12">
        <ContentStreamSidebar
          contents={contents}
          loader={loader}
          // checkedAll={checkedAll}
          singleCheck={singleCheck}
          youtubeVideoFilterd={contentStream}
          checkAll={checkAll}
          // footer={

          // }
        />
      </div>
    </div>
  );
};

// const AnalyticsButton = styled(Button)`
//   border-radius: 23px;
// `;

export default ContentStream;
