import React, { useEffect, useMemo, useState } from "react";

// components
import Checkbox from "../../components/forms/Checkbox";
import { PLATFORM_ICON_MAP } from "../../components/helpers/platforms";
import { Accordion, AccordionHeader } from "../../components/layouts/Accordion";
import MainContent from "./shared/MainContent";
import PageTitle from "./shared/PageTitle";
import { v4 as uuidv4 } from "uuid";
import PlatformAccordion from "./upload/accordions/PlatformAccordion";
import MediaAccordion from "./upload/accordions/MediaAccordion";
import YouTubePlatformInputs from "./upload/accordions/YouTubePlatformInputs";
import TwitterPlatformInputs from "./upload/accordions/TwitterPlatformInputs";
import LinkedInPlateFormInputs from "./upload/accordions/LinkedInPlateFormInputs";
import FacebookPlateForm from "./upload/accordions/FacebookPlateForm";
import InstagramPlatformInputs from "./upload/accordions/InstagramPlatformInputs";
import ContributorsAccordion from "./upload/accordions/ContributorsAccordion";
import VerifyPostAccordion from "./upload/accordions/VerifyPostAccordion";
import MintNFtAccordion from "./upload/accordions/MintNFtAccordion";
import ViewAccordion from "./upload/accordions/ViewAccordion";
import twitterApi from "../../helpers/TwitterApi.js";
// icons
import ZoomIcon from "../../components/icons/ZoomIcon";
import BrowserIcon from "../../components/icons/BrowserIcon";
import InstagramIcon from "../../components/icons/InstagramIcon";
import UploadSidebar from "./shared/UploadSidebar";
import axios from "axios";
// import { SkynetClient } from "skynet-js";
const MEDIA_ICON_MAP = {
  zoom: (args) => <ZoomIcon {...args} />,
  device: (args) => <BrowserIcon {...args} />,
  library: (args) => <InstagramIcon {...args} />,
};

const Disclaimer = ({ agree, onConfirm }) => {
  const id = useMemo(() => Math.random().toString(16).substr(2), []);

  return (
    <div className="space-y-2">
      <p className="text-xxs text-gray-400 max-w-xl">
        Disclaimer: I agree that when I publish content to third party platforms
        (for example, YouTube and Twitter). I must abide by the terms of use of
        those platforms, including all terms relating to copyright and other
        intellectual property rights. I understand that Streambed’s terms of use
        do not replace or supersede the terms of use of those platforms. Read
        more.
      </p>
      <Checkbox
        label="I agree to disclaimer and wish to proceed"
        name={id}
        checked={agree}
        onChange={() => {
          onConfirm(!agree);
        }}
      />
    </div>
  );
};

const accordionsOrder = [
  "platform",
  "media",
  "inputs",
  "contributors",
  "mintNFT",
  "verifyPost",
  "view",
];
// TODO: track eligible open states with index < step counter
const Upload = () => {
  const [processing, setProcessing] = useState(false);
  const [platform, setPlatform] = useState("");
  const [showPlatforms, setShowPlatforms] = useState(true);
  // file -> { type, duration, data }
  const [media, setMedia] = useState({ mediaSource: null, file: null });
  const [platformInputs, setPlatformInputs] = useState(null);
  const [contributors, setContributors] = useState([]);
  // const [agreeToPost, setAgreeToPost] = useState(false);
  // use this to store whatever output you need from a successful
  // post.
  const [postResult, setPostResult] = useState({
    data: null,
    error: null,
  });
  const [accordions, setAccordions] = useState({
    platform: false,
    media: false,
    inputs: false,
    contributors: false,
    mintNFT: false,
    verifyPost: false,
    view: false,
  });
  const [accordionCursor, setAccordionCursor] = useState(0);
  const [step, setStep] = useState(1);
  const [facebook, setFacebook] = useState(null);
  // const [zoom, setZoom] = useState(false);
  const [instagram, setInstagram] = useState(null);
  const [linkedin, setLinkedin] = useState(null);
  const [twitterTokens, setTwitterTokens] = useState(null);
  const [hasRT, setHasRT] = useState("");
  const [siaUrl, setSiaUrl] = useState("");
  const [txid, setTxid] = useState("");
  const [videoId, setVideoId] = useState("");
  const [selectLinkedInPage, setSelectLinkedInPage] = useState("");
  const [targetLinkedIn, setTargetLinkedIn] = useState("");
  const [youtubeFeilds, setYouTubeFeilds] = useState({
    title: "",
    visibility: "",
    desc: "",
    thumbnail: "",
  });
  const [fileUpload, setFileUpload] = useState("");
  const token = window.localStorage.getItem("token");
  const platforms = {
    hasRT,
    instagram,
    linkedin,
    facebook,
    twitterTokens,
  };

  const updateAccordion = (name, value) => {
    if (value) {
      // set the cursor to this accordion
      const idx = accordionsOrder.indexOf(name);
      if (idx !== accordionCursor) {
        setAccordionCursor(idx);
      }
    }
    setAccordions({ ...accordions, [name]: value });
  };
  const SiaUrl = async (fields) => {
    var formData = new FormData();
    formData.append("body", fields.title);
    formData.append("body", fields.description);
    formData.append("myFiles", fileUpload.file);
    const vid = uuidv4();
    sessionStorage.setItem("vid", vid);
    await axios
      .post("/api/uploaded", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          vid: vid,
        },
      })
      .then((res) => {
        setSiaUrl(res.data.sia_url);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  const uploadimage = async (fields) => {
    let formData = new FormData();
    sessionStorage.setItem("videoTitle", fields.title);
    formData.append("file", fields.thumbnail);
    formData.append("title", fields.title);
    formData.append("desc", fields.description);
    formData.append("visibility", fields.visibilitySetting);
    await axios
      .post("/api/thumbnail-upload", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          vid: sessionStorage.getItem("vid"),
        },
      })
      .then((res) => {
        if (res.videoinfo) {
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  // useEffect(async () => {
  //   if (youtubeFeilds.thumbnail) {
  //     await SiaUrl();
  //     await uploadimage();
  //   }
  // }, [youtubeFeilds]);
  const goToAccordion = async (index, file, selectedPage, target) => {
    if (selectedPage && target) {
      setSelectLinkedInPage(selectedPage);
      setTargetLinkedIn(target);
    }
    if (file) {
      setFileUpload(file);
    }
    if (youtubeFeilds) if (accordionCursor === index) return;
    // close the previous one
    updateAccordion(accordionsOrder[accordionCursor], false);
    setAccordionCursor(index);
    if (index + 1 === step + 1) {
      setStep(step + 1);
    }
  };
  useEffect(() => {
    twitterApi.getTokens().then((message) => {
      setTwitterTokens(message);
    });
  }, []);

  const validateMediaFile = (_file) => true;

  useEffect(() => {
    setPlatformInputs(null);
    setMedia({ mediaSource: null, file: null });
  }, [platform]);
  const PlatformInputsFeild = async (title) => {
    await SiaUrl(title);

    await uploadimage(title);

    setYouTubeFeilds({
      title: title.title,
      visibility: title.visibilitySetting,
      desc: title.description,
      thumbnail: title.thumbnail,
    });
  };

  useEffect(() => {
    const accords = {};
    for (let key in accordions) {
      accords[key] = false;
    }
    accords[accordionsOrder[accordionCursor]] = true;
    setAccordions(accords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accordionCursor]);
  const sendWalletData = (b_obj, videoID) => {
    axios({
      method: "post",
      url: "/api/youtube-flo-blockchain",
      headers: {
        "content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      data: {
        youTubeData: b_obj,
        p_id: videoID,
        userAddress: JSON.parse(localStorage.getItem("userAddress")),
      },
    }).then((res) => {
      setTxid(res.data.txid);
    });
  };
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
        const { rT, facebook, instagram, linkedin } = res;
        setHasRT(rT);
        setFacebook(facebook);
        // setZoom(zoomIsActive);
        setInstagram(instagram);
        setLinkedin(linkedin);
      });
    // eslint-disable-next-line
  }, []);

  const uploadToYoutube = async () => {
    await fetch("/api/upload-youtube", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        videoCollaborators: contributors,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.err) {
          console.log("error");
          // setShowAlertMessage(
          //   "Authorization failed, make sure you have linked youtube app or authrozed strembed app to manage youtube data"
          // );
          // setShowAlert(true);
          // handleRemoveData();
          // handleResponseError(data.err);
        } else {
          setVideoId(data.id);
          // setYoutubeData(data);
          // walletData(data);
          sendWalletData(data, data.id);
          // sessionStorage.setItem("videoTitle", data.snippet.title);
          // sessionStorage.setItem("videoid", data.id);
          // dispatch(setVideoStep(5));
          // dispatch(setUplaodProgress(100));
        }
      })
      .catch((err) => {
        // dispatch(setVideoStep(1));
        // dispatch(setUplaodProgress(0));
        console.log("Something went wrong", err);
      });
  };

  const uploadToTwitter = async () => {
    const token = localStorage.getItem("token");
    const { statusText: post } = platformInputs;

    const fd = new FormData();
    fd.append("post", post);
    if (media.file) {
      fd.append("t-media", media.file.data);
    }

    const res = await axios.post(
      `/api/twitter/post-video?post=${encodeURIComponent(post)}`,
      fd,
      {
        headers: { Authorization: token },
      }
    );

    const { success, tweet } = res.data;
    if (!success) {
      throw new Error("Twitter post unsuccessful");
    }

    // collaborators
    if (contributors.length) {
      const payload = {
        collaborator: contributors,
        t_id: tweet.id_str,
        t_str_id: tweet.id_str,
      };
      await axios.post(`/api/twitter/add-collaborator`, payload, {
        headers: { Authorization: token },
      });
    }

    return tweet;
  };
  const uploadToFacebook = async () => {
    const { statusText, selectedPage, target } = platformInputs;
    let formData = new FormData();
    formData.append("post", statusText);
    formData.append("uploadTo", JSON.stringify(selectedPage));
    formData.append("target", target);
    // const client = new SkynetClient();
    // async function uploadExample() {
    //   try {
    //     const skylink = await client.uploadFile(media.file.data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    if (media.file) {
      formData.append("myFile", media.file.data);
    }
    formData.append("description", statusText);
    const res = await axios.post(
      `/api/facebook/post-video?post=${statusText}`,
      formData,
      {
        headers: { Authorization: token },
      }
    );

    const { success, FB_DOC } = res.data;
    if (!success) {
      throw new Error("Facebook post unsuccessful");
    }
    if (contributors.length) {
      axios({
        method: "post",
        url: "/api/facebook/add-collaborator",
        headers: {
          "content-type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        data: {
          collaborator: contributors,
          vid: FB_DOC.vid,
          p_id: FB_DOC._id,
        },
      }).then((res) => {
        // data for blockchain
        const { post } = res.data;
        //data for blockchain
        const b_obj = {};
        b_obj.title = post.message || "facebook post";
        b_obj.url = post.media_url;
        b_obj.displayName = post.username;
        b_obj.id = post.post_id;
        b_obj.fileName = post.vid || "";
        sessionStorage.setItem("p_id", post.post_id);
        facebookFloBlockChain(b_obj, post.post_id);
      });
    }
    return FB_DOC;
  };
  const facebookFloBlockChain = (b_obj, id_str) => {
    axios({
      method: "post",
      url: "/api/facebook/facebook-flo-blockchain",
      headers: {
        "content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      data: {
        b_obj: b_obj,
        p_id: id_str,
        userAddress: JSON.parse(localStorage.getItem("userAddress")),
      },
    }).then((res) => {
      setTxid(res.data.txid);
    });
  };
  const uploadToLinkedIn = async () => {
    const token = localStorage.getItem("token");
    const { statusText: post } = platformInputs;
    let formData = new FormData();
    formData.append("post", post);
    formData.append("uploadTo", JSON.stringify(selectLinkedInPage));
    formData.append("target", targetLinkedIn.target);
    formData.append("description", post);
    if (media.file) {
      formData.append("myFile", media.file.data);
    }
    const res = await axios.post(
      `/api/linkedin/post-video?post=${post}`,
      formData,
      {
        headers: { Authorization: token },
      }
    );

    const { success, userPosts } = res.data;
    if (!success) {
      throw new Error("linkedin post unsuccessful");
    }

    // collaborators
    if (contributors.length) {
      const payload = {
        collaborator: contributors,
        s_id: userPosts.share_id,
        p_id: userPosts._id,
      };
      await axios.post(`/api/linkedin/add-collaborator`, payload, {
        headers: { Authorization: token },
      });
    }

    return userPosts;
  };
  const InstagramFloBlockChain = (b_obj, id_str) => {
    axios({
      method: "post",
      url: "/api/instagram/instagram-flo-blockchain",
      headers: {
        "content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      data: {
        b_obj: b_obj,
        p_id: id_str,
        userAddress: JSON.parse(localStorage.getItem("userAddress")),
      },
    }).then((res) => {
      setTxid(res.data.txid);
    });
  };
  const uploadInstagramIndex = async () => {
    const { file } = media;
    let url = "/api/instagram/add-index";
    const res = await axios({
      method: "post",
      url: url,
      headers: {
        "content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      data: {
        user: {
          id: file.data.id,
          media_type: file.data.media_type,
          media_url: file.data.media_url,
          username: file.data.username | "",
          timestamp: file.data.media_url.timestamp || "",
          title: file.data.caption || "",
          permalink: file.data.permalink,
        },
      },
    });

    const { success, permalink, vid, newRecord } = res.data;
    if (!success) {
      throw new Error("instagram post unsuccessful");
    }

    // collaborators
    let siaurl = "";
    if (contributors.length) {
      await axios({
        method: "post",
        url: "/api/instagram/add-collaborator",
        headers: {
          "content-type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        data: {
          collaborator: contributors,
          vid: vid,
          permalink: permalink,
        },
      }).then((res) => {
        const { post } = res.data;
        siaurl = post.sia_url;
        // data for blockchain
        const b_obj = {};

        b_obj.title = post.text || "instagram post";
        //TODO! to be updated to instagram post link
        b_obj.url = post.media_url;
        b_obj.displayName = post.username;
        b_obj.id = post.post_id;
        b_obj.fileName = post.vid || "";
        sessionStorage.setItem("p_id", post.post_id);

        post.permalink = permalink;
        // walletData(b_obj);

        InstagramFloBlockChain(b_obj, post.post_id);
      });
    }
    const dataInstagram = {
      permalink,
      siaurl,
      newRecord,
    };
    return { dataInstagram };
  };

  const handlePostData = async (...args) => {
    if (processing) return;
    setProcessing(true);
    setPostResult({ data: null, error: null });

    try {
      let data;
      switch (platform) {
        case "YouTube":
          data = await uploadToYoutube();
          break;
        case "Twitter":
          data = await uploadToTwitter();
          break;
        case "Linkedin":
          data = await uploadToLinkedIn();
          break;
        case "Facebook":
          data = await uploadToFacebook();
          break;
        case "Instagram":
          data = await uploadInstagramIndex();
          break;
        default:
          break;
      }
      if (data) {
        setPostResult({ ...postResult, data });
      }
      goToAccordion(...args);
    } catch (error) {
      console.error(`An error occured while posting to ${platform}`);
      console.error(error);
      setPostResult({ ...postResult, error: error.message });
    }

    setProcessing(false);

    // still necessary?
    // setAgreeToPost(true);
  };

  const onFileSelect = () => {};
  return (
    <div className="flex w-full relative">
      <MainContent className="w-full lg:w-8/12 xl:w-9/12">
        <PageTitle>Upload Content</PageTitle>
        <div className="mt-6 space-y-4" style={{ maxWidth: "1200px" }}>
          <Accordion
            open={accordions.platform}
            onOpen={() => updateAccordion("platform", true)}
            onClose={() => updateAccordion("platform", false)}
            className="bg-white"
            header={
              <AccordionHeader
                open={accordions.platform}
                label="Select Platform"
                labelClassName="text-base"
                right={
                  platform
                    ? PLATFORM_ICON_MAP[platform]({ className: "w-5 h-auto" })
                    : null
                }
              />
            }
            body={
              <div>
                <Disclaimer
                  agree={showPlatforms}
                  onConfirm={setShowPlatforms}
                />
                {showPlatforms && (
                  <PlatformAccordion
                    index={0}
                    platform={platform}
                    onChange={setPlatform}
                    onNext={goToAccordion}
                    platforms={platforms}
                  />
                )}
              </div>
            }
          />

          <Accordion
            open={accordions.media}
            onOpen={() => step >= 2 && updateAccordion("media", true)}
            onClose={() => step >= 2 && updateAccordion("media", false)}
            className="bg-white"
            header={
              <AccordionHeader
                open={accordions.media}
                label="Select Media"
                labelClassName="text-base"
                right={
                  media.mediaSource
                    ? MEDIA_ICON_MAP[media.mediaSource]({
                        className: "h-8 w-auto",
                      })
                    : null
                }
              />
            }
            body={
              <MediaAccordion
                index={1}
                platform={platform}
                media={media}
                validateFile={validateMediaFile}
                onChange={setMedia}
                onNext={goToAccordion}
                onFileSelect={onFileSelect}
              />
            }
          />

          <Accordion
            open={accordions.inputs}
            onOpen={() => !!platform && updateAccordion("inputs", true)}
            onClose={() => !!platform && updateAccordion("inputs", false)}
            className="bg-white"
            header={
              <AccordionHeader
                open={accordions.inputs}
                label="Platform Inputs"
                labelClassName="text-base"
                right={
                  platform
                    ? PLATFORM_ICON_MAP[platform]({ className: "w-5 h-auto" })
                    : null
                }
              />
            }
            body={
              platform === "YouTube" ? (
                <YouTubePlatformInputs
                  index={2}
                  media={media}
                  platformInputs={platformInputs}
                  validateThumbnail={Boolean}
                  onSubmit={PlatformInputsFeild}
                  onNext={goToAccordion}
                />
              ) : platform === "Twitter" ? (
                <TwitterPlatformInputs
                  index={2}
                  media={media}
                  platformInputs={platformInputs}
                  onSubmit={setPlatformInputs}
                  onNext={goToAccordion}
                />
              ) : platform === "Instagram" ? (
                <InstagramPlatformInputs
                  index={2}
                  media={media}
                  platformInputs={platformInputs}
                  onSubmit={setPlatformInputs}
                  onNext={goToAccordion}
                />
              ) : platform === "Linkedin" ? (
                <LinkedInPlateFormInputs
                  index={2}
                  media={media}
                  platformInputs={platformInputs}
                  onSubmit={setPlatformInputs}
                  onNext={goToAccordion}
                />
              ) : platform === "Facebook" ? (
                <FacebookPlateForm
                  index={2}
                  media={media}
                  platformInputs={platformInputs}
                  onSubmit={setPlatformInputs}
                  onNext={goToAccordion}
                />
              ) : (
                <></>
              )
            }
          />

          <Accordion
            open={accordions.contributors}
            onOpen={() => step >= 4 && updateAccordion("contributors", true)}
            onClose={() => step >= 4 && updateAccordion("contributors", false)}
            className="bg-white"
            header={
              <AccordionHeader
                open={accordions.contributors}
                label="Identify Contributors"
                labelClassName="text-base"
                right={null}
              />
            }
            body={
              <ContributorsAccordion
                index={3}
                contributors={contributors}
                onSubmit={setContributors}
                onNext={goToAccordion}
              />
            }
          />

          <Accordion
            open={accordions.mintNFT}
            onOpen={() => step >= 5 && updateAccordion("mintNFT", true)}
            onClose={() => step >= 5 && updateAccordion("mintNFT", false)}
            className="bg-white"
            header={
              <AccordionHeader
                open={accordions.mintNFT}
                label="Set Terms & Mint NFT"
                labelClassName="text-base"
                right={null}
              />
            }
            body={
              <MintNFtAccordion
                index={4}
                platform={platform}
                media={media}
                platformInputs={platformInputs}
                youtubeFeilds={youtubeFeilds}
                contributors={contributors}
                onNext={goToAccordion}
              />
            }
          />
          <Accordion
            open={accordions.verifyPost}
            onOpen={() => step >= 6 && updateAccordion("verifyPost", true)}
            onClose={() => step >= 6 && updateAccordion("verifyPost", false)}
            className="bg-white"
            header={
              <AccordionHeader
                open={accordions.verifyPost}
                label="Verify & Post"
                labelClassName="text-base"
                right={null}
              />
            }
            body={
              <VerifyPostAccordion
                index={5}
                platform={platform}
                media={media}
                platformInputs={platformInputs}
                youtubeFeilds={youtubeFeilds}
                contributors={contributors}
                processing={processing}
                postResult={postResult}
                onNext={handlePostData}
                // onNext={goToAccordion}
              />
            }
          />
          <Accordion
            open={accordions.view}
            onOpen={() => step >= 7 && updateAccordion("view", true)}
            onClose={() => step >= 7 && updateAccordion("view", false)}
            className="bg-white"
            header={
              <AccordionHeader
                open={accordions.view}
                label="View"
                labelClassName="text-base"
                right={null}
              />
            }
            body={
              <ViewAccordion
                index={6}
                platform={platform}
                media={media}
                platformInputs={platformInputs}
                contributors={contributors}
                siaUrl={siaUrl}
                txid={txid}
                videoId={videoId}
                postResult={postResult}
                onNext={goToAccordion}
              />
            }
          />
        </div>
      </MainContent>
      <div className="hidden lg:block lg:w-4/12 xl:w-3/12">
        <UploadSidebar step={step} />
      </div>
    </div>
  );
};

export default Upload;
