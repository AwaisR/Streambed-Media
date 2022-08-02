import React, { useEffect, useMemo, useState } from "react";
import { styled } from "twin.macro";
import Picker from "emoji-picker-react";

// components
import {
  Card,
  CardContent,
  CardFooter,
} from "../../../../components/layouts/Card";
import Textarea from "../../../../components/forms/Textarea";

// icons
import RotatedBarChartIcon from "../../../../components/icons/RotatedBarChartIcon";
import SmileyIcon from "../../../../components/icons/SmileyIcon";
import CalendarWithTimeIcon from "../../../../components/icons/CalendarWithTimeIcon";
import GroupIcon from "../../../../assets/images/Group.svg";
import PageIcon from "../../../../assets/images/Pages.svg";
import { NextButton } from "./shared";

const FlatTextarea = styled(Textarea)`
  box-shadow: none;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
`;

const FacebookPlateForm = ({
  index,
  media,
  platformInputs,
  onSubmit,
  onNext,
}) => {
  const [statusText, setStatusText] = useState(
    platformInputs?.statusText || ""
  );
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [facebook, setFacebook] = useState({});
  const [target, setTarget] = useState("");
  const [selectedPage, setSelectedPage] = useState([]);
  const setTargetSelection = (e, target) => {
    setTarget(target);
    if (target === "pages") {
      facebook.pages.forEach((item, index) => {
        if (item.page_id === e.target.id) {
          setSelectedPage(item);
        }
      });
    } else {
      if (target === "groups") {
        facebook.groups.forEach((item, index) => {
          if (item.id === e.target.id) {
            setSelectedPage(item);
          }
        });
      }
    }
    // setSelected({ id: e.target.id, target: target });
  };

  const mediaURL = useMemo(() => {
    const { file } = media;

    if (!file) return;
    return window.URL.createObjectURL(file.data);
    // eslint-disable-next-line
  }, [media.file]);

  const formValid = !!statusText && !!selectedPage.name;

  const isFormValid = () => formValid;

  const onEmojiClick = (_, data) => {
    setStatusText(statusText + data.emoji);
  };

  const toggleEmojiPicker = () => {
    setEmojiPicker(!emojiPicker);
  };

  const handlePotentialEmojiPickerBlur = (evt) => {
    if (!emojiPicker) return;
    let depth = 15;
    let node = evt.target;
    let foundContainer = false;
    while (depth-- > 0 && node) {
      if (node.id === "twitterEmojiPicker") {
        foundContainer = true;
        break;
      }
      node = node.parentNode;
    }
    // hide emoji picker when it has lost focus
    if (!foundContainer) {
      setEmojiPicker(false);
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (submitting) return;
    setSubmitting(true);

    if (isFormValid()) {
      onSubmit({ statusText, selectedPage, target });
      onNext(index + 1);
    }

    setSubmitting(true);
  };

  useEffect(() => {
    fetch("/api/facebook/get-info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const { facebook } = data;
        console.log("facebook", facebook);
        setFacebook(facebook);
      })
      .catch((error) => {
        console.log("something went wrong", error);
      });
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    setStatusText(platformInputs?.statusText || "");
  }, [platformInputs]);

  useEffect(() => {
    document.addEventListener("click", handlePotentialEmojiPickerBlur);
    return () => {
      document.removeEventListener("click", handlePotentialEmojiPickerBlur);
    };
    // eslint-disable-next-line
  }, [emojiPicker]);

  useEffect(() => {
    return () => {
      // cleanup
      if (mediaURL) {
        window.URL.revokeObjectURL(mediaURL);
      }
    };
    // eslint-disable-next-line
  }, []);
  //   const onChanges = () => {};
  //   const GroupPagesCard = (icon, title, onChanges, group) => {
  //     return (
  //       <Card className="fbgroup-card">
  //         <CardContent>
  //           <div className="flex max-w-md	items-center groups-wraper">
  //             <img src={icon} alt="group-icon" />
  //             <p className="facebook-group">{title}</p>
  //           </div>
  //           <hr className="my-4" />
  //           <div className="flex justify-between items-center	">
  //             <div className="group-content">
  //               <img src={group.icon} alt="group-icon" />
  //               <label for={group.id}> {group.name}</label>
  //             </div>
  //             <div>
  //               <input
  //                 type="radio"
  //                 id={group.id}
  //                 name="fav_language"
  //                 value="HTML"
  //                 onChange={onChanges}
  //               />
  //             </div>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     );
  //   };
  return (
    <div className="py-2">
      <p>
        Streambed can post to Facebook pages or groups via your account. For
        personal timeline posts, locate your post in the Content Stream on the
        Dashboard and create an index page.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="w-full xl:w-5/12 p-1 facebook-wrapper">
          <Card className="fbgroup-card">
            <CardContent>
              <div className="flex max-w-md	items-center groups-wraper">
                <img src={GroupIcon} alt="group-icon" />
                <p className="facebook-group">Your Groups</p>
              </div>
              <hr className="my-4" />
              {facebook &&
                facebook.groups &&
                facebook.groups.map((group) => (
                  <div className="flex justify-between items-center mb-2">
                    <div className="group-content">
                      <img src={group.icon} alt="group-icon" />
                      <label htmlFor={group.id}> {group.name}</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id={group.id}
                        name="radio1"
                        onChange={(e) => {
                          setTargetSelection(e, "groups");
                        }}
                      />
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* {GroupPagesCard(GroupIcon, "Your Groups", onChanges, "I have a bike")} */}
          {/* {facebook &&
            facebook.pages &&
            facebook.pages.map((pages) =>
             
             
            )} */}
          {/* {GroupPagesCard(PageIcon, "Your Pages", onChanges, "I have a bike")} */}
          {/* <Card className="fbgroup-card">
            <CardContent>
              <div className="flex max-w-md	items-center groups-wraper">
                <img src={GroupIcon} alt="group-icon" />
                <p className="facebook-group">Your Groups</p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between items-center	">
                <div className="group-content">
                  <img src={GroupIcon} alt="group-icon" />
                  <label for="vehicle1"> I have a bike</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="html"
                    name="fav_language"
                    value="HTML"
                  />
                </div>
              </div>
            </CardContent>
          </Card> */}
          {/* <Card className="fbgroup-card">
            <CardContent>
              <div className="flex max-w-md	items-center groups-wraper">
                <img src={PageIcon} alt="group-icon" />
                <p className="facebook-group">Your Pages</p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between items-center	">
                <div className="group-content">
                  <img src={PageIcon} alt="group-icon" />
                  <label for="vehicle1"> I have a bike</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="html"
                    name="fav_language"
                    value="HTML"
                  />
                </div>
              </div>
            </CardContent>
          </Card> */}

          <Card className="fbgroup-card">
            <CardContent>
              <div className="flex max-w-md	items-center groups-wraper">
                <img src={GroupIcon} alt="group-icon" />
                <p className="facebook-group">Your Pages</p>
              </div>
              <hr className="my-4" />
              {facebook &&
                facebook.pages &&
                facebook.pages.map((pages) => (
                  <div className="flex justify-between items-center	mb-2">
                    <div className="group-content">
                      <img src={PageIcon} alt="group-icon" />
                      <label htmlFor={pages.page_id}> {pages.name}</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id={pages.page_id}
                        name="radio1"
                        onChange={(e) => {
                          setTargetSelection(e, "pages");
                        }}
                      />
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-10/12 flex flex-col items-center xl:flex-row xl:items-start">
          <div className="w-full xl:w-7/12 p-1 fbgroup-card">
            <Card>
              <FlatTextarea
                name="tweetStatus"
                placeholder="|Enter post message"
                rows="4"
                maxLength="280"
                value={statusText}
                onChange={(e) => {
                  setStatusText(e.target.value);
                }}
                required
              />
              <hr />
              <CardFooter>
                <CardContent>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex space-x-2 text-primary">
                      <RotatedBarChartIcon className="w-4 h-auto" />
                      <SmileyIcon
                        className="w-4 h-auto"
                        onClick={toggleEmojiPicker}
                      />
                      <CalendarWithTimeIcon className="w-4 h-auto" />
                    </div>
                    <p className="text-primary">{statusText.length}/280</p>
                  </div>
                </CardContent>
              </CardFooter>
            </Card>

            {emojiPicker && (
              <div id="twitterEmojiPicker" className="mt-2 absolute z-50">
                <Picker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>

          <div className="w-full xl:w-5/12 p-1 facebook-preview">
            <Card>
              <CardContent style={{ minHeight: "124px" }}>
                {mediaURL && media.file.type === "image" ? (
                  <img
                    className="block w-full h-52 object-cover"
                    src={mediaURL}
                    style={{ overflow: "hidden", maxHeight: "124px" }}
                    alt="meidaImage"
                  />
                ) : mediaURL && media.file.type === "video" ? (
                  <video
                    className="block w-full h-52 object-cover"
                    src={mediaURL}
                    style={{ height: "100%" }}
                    controls
                  ></video>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-between mt-3 items-end">
          <p className="text-xxs">All fields must be completed to continue.</p>

          <NextButton disabled={!formValid}>Next</NextButton>
        </div>
      </form>
    </div>
  );
};

export default FacebookPlateForm;
