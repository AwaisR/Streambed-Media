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

import { NextButton } from "./shared";

const FlatTextarea = styled(Textarea)`
  box-shadow: none;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
`;

const TwitterPlatformInputs = ({
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

  const mediaURL = useMemo(() => {
    const { file } = media;
    if (!file) return;
    return window.URL.createObjectURL(file.data);
    // eslint-disable-next-line
  }, [media.file]);

  const formValid = !!statusText;

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
      onSubmit({ statusText });
      onNext(index + 1);
    }

    setSubmitting(true);
  };

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

  return (
    <div className="py-2">
      <form onSubmit={handleSubmit}>
        <div className="w-full md:w-10/12 flex flex-col items-center xl:flex-row xl:items-start">
          <div className="w-full xl:w-7/12 p-1">
            <Card>
              <FlatTextarea
                name="tweetStatus"
                placeholder="What's happening?"
                rows="7"
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
          {mediaURL ? (
            <div className="w-full xl:w-5/12 p-1">
              <Card>
                <CardContent>
                  {mediaURL && media.file.type === "image" ? (
                    <img
                      className="block w-full h-52 object-cover"
                      src={mediaURL}
                      alt="imageMedia"
                    />
                  ) : mediaURL && media.file.type === "video" ? (
                    <video
                      className="block w-full h-52 object-cover"
                      src={mediaURL}
                      controls
                    ></video>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
        <div className="flex justify-between mt-3 items-end">
          <p className="text-xxs">All fields must be completed to continue.</p>

          <NextButton disabled={!formValid}>Next</NextButton>
        </div>
      </form>
    </div>
  );
};

export default TwitterPlatformInputs;
