import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// components
import { Card, CardContent } from "../../../../components/layouts/Card";
import Checkbox from "../../../../components/forms/Checkbox";
import moment from "moment";
// icons
import ArrowRightIcon from "../../../../components/icons/ArrowRightIcon";
import BrowserIcon from "../../../../components/icons/BrowserIcon";
import ZoomIcon from "../../../../components/icons/ZoomIcon";

// seed
// import instagramPosts from "../../../seed/instagramPosts";

import { NextButton } from "./shared";

const MediaAccordion = ({
  index,
  platform,
  media,
  validateFile,
  onChange,
  onNext,
}) => {
  const [instagramPost, setInstagramPosts] = useState([]);
  const [indexedPosts, setIndexPosts] = useState([]);
  const updateMediaFile = (file) => {
    onChange({ mediaSource: "device", file });
  };
  const getInstagramPosts = (token) => {
    fetch("/api/instagram/get-posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((posts) => {
        // setLoading(false);
        setInstagramPosts(posts.data);
        setIndexPosts(posts.indexPosts);
      })
      .catch((err) => {
        // setLoading(false);
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
    const token = localStorage.getItem("token");
    getInstagramPosts(token);
  }, []);
  return (
    <div>
      {platform === "YouTube" ? (
        <YouTubeMediaPicker
          index={index}
          media={media}
          onFileSelect={updateMediaFile}
          onNext={onNext}
          validateFile={validateFile}
        />
      ) : platform === "Twitter" ? (
        <TwitterMediaPicker
          index={index}
          media={media}
          onFileSelect={updateMediaFile}
          onNext={onNext}
          validateFile={validateFile}
        />
      ) : platform === "Instagram" ? (
        <InstagramMediaPicker
          index={index}
          media={media}
          onFileSelect={updateMediaFile}
          onNext={onNext}
          instagramPost={instagramPost}
        />
      ) : platform === "Linkedin" ? (
        <LinkedInMediaPicker
          index={index}
          media={media}
          onFileSelect={updateMediaFile}
          validateFile={validateFile}
          onNext={onNext}
        />
      ) : platform === "Facebook" ? (
        <FacebookMediaPicker
          index={index}
          media={media}
          onFileSelect={updateMediaFile}
          validateFile={validateFile}
          onNext={onNext}
        />
      ) : null}
    </div>
  );
};

export default MediaAccordion;

const YouTubeMediaPicker = ({
  index,
  media,
  validateFile,
  onMediaChange,
  onFileSelect,
  onNext,
  test,
}) => {
  const [fileLoadPercent, setFileLoadPercent] = useState(0);
  const [uploadFile, setUploadFile] = useState({
    file: null,
  });
  const hasFile = Boolean(media.file);

  const handleFileSelect = async (files) => {
    if (!files.length) {
      onFileSelect(null);
      setFileLoadPercent(0);
    } else if (!validateFile(files[0])) {
      setFileLoadPercent(0);
    } else {
      const info = await getVideoInfo(files[0], (percent) => {
        setFileLoadPercent(percent);
      });
      setUploadFile({
        file: files[0],
      });
      onFileSelect({
        ...info,
        data: files[0],
      });
    }
  };
  const handleSubmit = (e) => {
    onNext(index + 1, uploadFile);
  };
  return (
    <div>
      <p className="text-sm font-light">
        Choose where you would like to search for media files.
      </p>
      <div className="mt-4 flex flex-wrap justify-center md:justify-start">
        <Card
          className="mb-4 mx-2 w-36"
          // onClick={() => onMediaChange("zoom")}
        >
          <CardContent className="h-28 text-center flex flex-col items-center justify-center">
            <div>
              <ZoomIcon className="w-12 h-auto" />
            </div>
            <p className="mt-0 text-xs">Upload from cloud recordings</p>
          </CardContent>
        </Card>
        <label htmlFor="deviceMedia">
          <input
            id="deviceMedia"
            type="file"
            accept="video/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            hidden
          />
          <Card className="mb-4 mx-2 w-36">
            <CardContent className="h-28 text-center flex flex-col items-center justify-center">
              <div>
                <BrowserIcon className="w-12 h-auto" />
              </div>
              <p className="mt-0 text-xs">Browse your device</p>
            </CardContent>
          </Card>
        </label>
        <Card
          className="mb-4 mx-2 w-36"
          // onClick={() => onMediaChange("library")}
        >
          <CardContent className="h-28 text-center flex flex-col items-center justify-center">
            <div>
              <BrowserIcon className="w-12 h-auto" />
            </div>
            <p className="mt-0 text-xs">Browse Content Library</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-2 space-x-3 flex justify-between items-end">
        {hasFile ? (
          <div className="w-10/12 space-y-1">
            <p className="text-gray-400 text-xs">
              {fileLoadPercent === 1 ? "Loading completed" : "Loading file..."}
            </p>
            <div className="w-full h-4 rounded-lg border border-gray-500 p-0 flex items-center">
              <div
                className="p-0 h-2 mx-1 rounded-lg bg-primary"
                style={{
                  width: `${Math.round(fileLoadPercent * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <NextButton disabled={!hasFile} onClick={() => handleSubmit()}>
          Next
        </NextButton>
      </div>
    </div>
  );
};
const FacebookMediaPicker = ({
  index,
  media,
  validateFile,
  onMediaChange,
  onFileSelect,
  onNext,
  test,
}) => {
  const [fileLoadPercent, setFileLoadPercent] = useState(0);
  // const [uploadFile, setUploadFile] = useState({
  //   file: null,
  // });
  const hasFile = Boolean(media.file);
  const uploadFile = {
    file: null,
  };
  const handleFileSelect = async (files) => {
    if (!files.length) {
      onFileSelect(null);
      setFileLoadPercent(0);
    } else if (!validateFile(files[0])) {
      setFileLoadPercent(0);
    } else {
      let type = "",
        info = {};
      if (files[0].type.startsWith("video/")) {
        type = "video";
        info = await getVideoInfo(files[0], (percent) => {
          setFileLoadPercent(percent);
        });
      } else if (files[0].type.startsWith("image/")) {
        type = "image";
        info = await getImageInfo(files[0], (percent) => {
          setFileLoadPercent(percent);
        });
      }
      onFileSelect({
        ...info,
        type, // image / video
        data: files[0],
      });
    }
  };

  const handleSubmit = (e) => {
    onNext(index + 1, uploadFile);
  };
  return (
    <div>
      <p className="text-sm font-light">
        Choose where you would like to search for media files.
      </p>
      <div className="mt-4 flex flex-wrap justify-center md:justify-start">
        <Card
          className="mb-4 mx-2 w-36"
          //  onClick={() => onMediaChange("zoom")}
        >
          <CardContent className="h-28 text-center flex flex-col items-center justify-center">
            <div>
              <ZoomIcon className="w-12 h-auto" />
            </div>
            <p className="mt-0 text-xs">Upload from cloud recordings</p>
          </CardContent>
        </Card>
        <label htmlFor="deviceMedia">
          <input
            id="deviceMedia"
            type="file"
            accept="image/*,video/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            hidden
          />
          <Card className="mb-4 mx-2 w-36">
            <CardContent className="h-28 text-center flex flex-col items-center justify-center">
              <div>
                <BrowserIcon className="w-12 h-auto" />
              </div>
              <p className="mt-0 text-xs">Browse your device</p>
            </CardContent>
          </Card>
        </label>
        {/* <Card
          className="mb-4 mx-2 w-36"
          onClick={() => onMediaChange("library")}
        >
          <CardContent className="h-28 text-center flex flex-col items-center justify-center">
            <div>
              <BrowserIcon className="w-12 h-auto" />
            </div>
            <p className="mt-0 text-xs">Browse Content Library</p>
          </CardContent>
        </Card> */}
      </div>

      <div className="mt-2 space-x-3 flex justify-between items-end">
        {hasFile ? (
          <div className="w-10/12 space-y-1">
            <p className="text-gray-400 text-xs">
              {fileLoadPercent === 1 ? "Loading completed" : "Loading file..."}
            </p>
            <div className="w-full h-4 rounded-lg border border-gray-500 p-0 flex items-center">
              <div
                className="p-0 h-2 mx-1 rounded-lg bg-primary"
                style={{
                  width: `${Math.round(fileLoadPercent * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <NextButton disabled={!hasFile} onClick={() => handleSubmit()}>
          Next
        </NextButton>
      </div>
    </div>
  );
};
const TwitterMediaPicker = ({
  index,
  media,
  validateFile,
  onFileSelect,
  onNext,
}) => {
  const [fileLoadPercent, setFileLoadPercent] = useState(0);

  const handleFileSelect = async (files) => {
    if (!files.length) {
      onFileSelect(null);
      setFileLoadPercent(0);
    } else if (!validateFile(files[0])) {
      setFileLoadPercent(0);
    } else {
      let type = "",
        info = {};
      if (files[0].type.startsWith("video/")) {
        type = "video";
        info = await getVideoInfo(files[0], (percent) => {
          setFileLoadPercent(percent);
        });
      } else if (files[0].type.startsWith("image/")) {
        type = "image";
        info = await getImageInfo(files[0], (percent) => {
          setFileLoadPercent(percent);
        });
      }
      onFileSelect({
        ...info,
        type, // image / video
        data: files[0],
      });
    }
  };

  return (
    <div>
      <p className="text-sm font-light">
        Choose where you would like to search for media files.
      </p>
      <div className="mt-4">
        <label htmlFor="deviceMedia">
          <input
            id="deviceMedia"
            type="file"
            accept="image/*,video/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            hidden
          />
          <Card className="w-36 h-28">
            <CardContent className="text-center flex flex-col items-center justify-center">
              <div>
                <BrowserIcon className="w-12 h-auto" />
              </div>
              <p className="mt-0 text-xs">Browse your device</p>
            </CardContent>
          </Card>
        </label>
        <p className="mt-2 text-xxs font-light">
          *Videos on Twitter can be 30sec max.
        </p>
      </div>

      <div className="mt-6 space-x-3 flex justify-between items-end">
        {fileLoadPercent > 0 ? (
          <div className="w-10/12 space-y-1">
            <p className="text-gray-400 text-xs">
              {fileLoadPercent === 1 ? "Loading completed" : "Loading file..."}
            </p>
            <div className="w-full h-4 rounded-lg border border-gray-500 p-0 flex items-center">
              <div
                className="p-0 h-2 mx-1 rounded-lg bg-primary"
                style={{
                  width: `${Math.round(fileLoadPercent * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        ) : (
          <></>
        )}

        <NextButton className="ml-auto" onClick={() => onNext(index + 1)}>
          Next
        </NextButton>
      </div>
    </div>
  );
};

const LinkedInMediaPicker = ({
  index,
  media,
  validateFile,
  onMediaChange,
  onFileSelect,
  onNext,
  test,
}) => {
  const [fileLoadPercent, setFileLoadPercent] = useState(0);
  const [linkdin, setLinkedin] = useState({});
  const [selected, setSelected] = React.useState({ id: "", target: "" });
  const [selectedPage, setSelectedPage] = useState([]);
  // const [uploadFile, setUploadFile] = useState({
  //   file: null,
  // });
  const hasFile = Boolean(media.file);
  const uploadFile = {
    file: null,
  };
  const handleFileSelect = async (files) => {
    if (!files.length) {
      onFileSelect(null);
      setFileLoadPercent(0);
    } else if (!validateFile(files[0])) {
      setFileLoadPercent(0);
    } else {
      let type = "",
        info = {};
      if (files[0].type.startsWith("video/")) {
        type = "video";
        info = await getVideoInfo(files[0], (percent) => {
          setFileLoadPercent(percent);
        });
      } else if (files[0].type.startsWith("image/")) {
        type = "image";
        info = await getImageInfo(files[0], (percent) => {
          setFileLoadPercent(percent);
        });
      }
      onFileSelect({
        ...info,
        type, // image / video
        data: files[0],
      });
    }
  };

  const handleSubmit = (e) => {
    onNext(index + 1, uploadFile, selectedPage, selected);
  };
  const setTargetSelection = (e, target) => {
    setSelected({ id: e.target.id, target: target });
  };
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
  useEffect(() => {
    const { id, target } = selected;
    if (target === "pages") {
      linkdin.pages.forEach((item, index) => {
        if (item.organaization_id === id) {
          setSelectedPage(item);
        }
      });
    }
    // eslint-disable-next-line
  }, [selected]);

  return (
    <div>
      <p className="text-sm font-light mb-5">Your Company pages</p>
      <Card className="mb-4 mx-2 w-36">
        <CardContent className="h-28 text-center flex flex-col items-center justify-center">
          <div>
            {linkdin &&
              linkdin.pages &&
              linkdin.pages.map((item) => (
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    class="form-radio"
                    id={item.organaization_id}
                    name="accountType"
                    value="personal"
                    onChange={(e) => {
                      setTargetSelection(e, "pages");
                    }}
                  />
                  <span class="ml-2">{item.organaization_name}</span>
                </label>
              ))}
          </div>

          {/* <p className="mt-0 text-xs">Browse your device</p> */}
        </CardContent>
      </Card>

      <p className="text-sm font-light">
        Choose where you would like to search for media files.
      </p>
      <div className="mt-4 flex flex-wrap justify-center md:justify-start">
        <Card className="mb-4 mx-2 w-36" onClick={() => onMediaChange("zoom")}>
          <CardContent className="h-28 text-center flex flex-col items-center justify-center">
            <div>
              <ZoomIcon className="w-12 h-auto" />
            </div>
            <p className="mt-0 text-xs">Upload from cloud recordings</p>
          </CardContent>
        </Card>
        <label htmlFor="deviceMedia">
          <input
            id="deviceMedia"
            type="file"
            accept="image/*,video/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            hidden
          />
          <Card className="mb-4 mx-2 w-36">
            <CardContent className="h-28 text-center flex flex-col items-center justify-center">
              <div>
                <BrowserIcon className="w-12 h-auto" />
              </div>
              <p className="mt-0 text-xs">Browse your device</p>
            </CardContent>
          </Card>
        </label>
      </div>

      <div className="mt-2 space-x-3 flex justify-between items-end">
        {hasFile ? (
          <div className="w-10/12 space-y-1">
            <p className="text-gray-400 text-xs">
              {fileLoadPercent === 1 ? "Loading completed" : "Loading file..."}
            </p>
            <div className="w-full h-4 rounded-lg border border-gray-500 p-0 flex items-center">
              <div
                className="p-0 h-2 mx-1 rounded-lg bg-primary"
                style={{
                  width: `${Math.round(fileLoadPercent * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <NextButton
          disabled={!selectedPage.organaization_name}
          onClick={() => handleSubmit()}
        >
          Next
        </NextButton>
      </div>
    </div>
  );
};
const InstagramMediaPicker = ({
  index,
  media,
  onFileSelect,
  onNext,
  instagramPost,
}) => {
  const selectedPost = media.file?.data;
  // const [posts, setPosts] = useState([]);
  const carouselRef = useRef();
  const [scrollTween, setScrollTween] = useState(null);

  // useEffect(() => void setPosts(instagramPosts.slice()), []);

  const scrollLeft = () => {
    const { current: elem } = carouselRef;
    if (!elem) return;

    if (scrollTween) {
      scrollTween.kill();
    }

    const tween = gsap.to(elem, {
      scrollLeft: elem.scrollLeft + 500,
      duration: 0.3,
      // ease: "ease.in",
    });

    setScrollTween(tween);
  };

  return (
    <div className="w-full">
      <p className="text-sm font-light">
        Select a post from your Instagram feed to create an index page for.
      </p>
      <div className="mt-4 w-full relative">
        <div
          className="h-12 w-12 z-20 bg-white rounded-full shadow-lg absolute right-0 top-1/2 -mt-6 ml-4 flex items-center justify-center"
          onClick={scrollLeft}
        >
          <ArrowRightIcon />
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="p-2 overflow-x-auto whitespace-nowrap border-2 border-red-600 space-x-3 instagram-card-wrapper"
          >
            {instagramPost.map((post) => (
              <Card key={post._id} className="w-32 inline-block instagram-card">
                <CardContent className="text-center instgram-content">
                  <div className="w-full h-28 bg-gray-600">
                    {post.media_type === "VIDEO" ? (
                      <iframe src={post.media_url} title="videoTitle"></iframe>
                    ) : (
                      <div className="instagram-image">
                        <img
                          className="w-full h-28 object-cover"
                          alt="Instagram"
                          src={post.media_url}
                        />
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-copy text-xs flex justify-between items-center">
                    <p className="mr-2">
                      {moment(post.timestamp).format("ll")}
                    </p>
                    {post.indexed ? (
                      <StarIcon className="h-4 w-3" />
                    ) : (
                      <Checkbox
                        label=""
                        labelClassName="hidden"
                        className="w-3 h-3"
                        id={"insta_" + post.id}
                        name={"insta_" + post.id}
                        checked={
                          selectedPost ? selectedPost.id === post.id : false
                        }
                        onChange={() => {
                          if (selectedPost === post) onFileSelect(null);
                          else onFileSelect({ data: post });
                        }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-6 space-x-3 flex justify-between items-end">
          <div className="flex items-center">
            <StarIcon />
            <p className="text-xxs font-light ml-1">
              An index page has already been created for this post.
            </p>
          </div>

          <NextButton onClick={() => onNext(index + 1)}>Next</NextButton>
        </div>
      </div>
    </div>
  );
};

const StarIcon = React.memo((props) => (
  <svg
    data-name="Component 17 \u2013 35"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <defs>
      <clipPath id="prefix__a">
        <path data-name="Rectangle 472" fill="#fff" d="M0 0h20.223v19.354H0z" />
      </clipPath>
    </defs>
    <rect
      data-name="Rectangle 374"
      width={24}
      height={24}
      rx={4}
      fill="#548af0"
    />
    <g data-name="Group 782">
      <g
        data-name="Group 781"
        transform="translate(2.12 2.029)"
        clipPath="url(#prefix__a)"
      >
        <path
          data-name="Path 228"
          d="M10.111 1.24l2.094 6.445h6.777L13.5 11.669l2.095 6.445-5.483-3.983-5.483 3.982 2.094-6.445L1.24 7.685h6.777z"
          fill="#fff"
        />
      </g>
    </g>
  </svg>
));

const getImageInfo = async (file, onProgress) => {
  // read the file
  const reader = new FileReader();
  reader.onprogress = (evt) => {
    onProgress(evt.loaded / evt.total);
  };
  reader.readAsArrayBuffer(file);

  return await new Promise((resolve, reject) => {
    reader.onloadend = () => resolve({});
    reader.onerror = () => reject();
  });
};

const getVideoInfo = async (file, onProgress) => {
  const metadata = await loadVideoMetadata(file);

  // read the file
  const reader = new FileReader();
  reader.onprogress = (evt) => {
    onProgress(evt.loaded / evt.total);
  };
  reader.readAsArrayBuffer(file);

  return await new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(metadata);

    reader.onerror = () => reject();
  });
};

const loadVideoMetadata = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve({
        duration: Math.round(video.duration),
      });
    };

    video.onerror = reject;

    video.src = window.URL.createObjectURL(file);
  });
};
