import React, { useEffect, useState } from "react";
import clsx from "clsx";
// components
import { Card, CardContent } from "../../../../components/layouts/Card";
import RoundedInput from "../../../../components/forms/RoundedInput";
import Select from "../../../../components/forms/Select";
import Textarea from "../../../../components/forms/Textarea";

// icons
import BrowserIcon from "../../../../components/icons/BrowserIcon";
import ArrowRightIcon from "../../../../components/icons/ArrowRightIcon";

import {
  NEXT_BUTTON_ACTIVE_CLASSNAME,
  NEXT_BUTTON_DEFAULT_CLASSNAME,
  NEXT_BUTTON_INACTIVE_CLASSNAME,
} from "./shared";

const visibilitySettingOptions = {
  "": "Visibility Setting",
  private: "Private",
  public: "Public",
};

const YouTubePlatformInputs = ({
  index,
  platformInputs,
  validateThumbnail,
  onSubmit,
  onNext,
}) => {
  const [title, setTitle] = useState("");
  const [visibilitySetting, setVisibilitySetting] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailObjectURL, setThumbnailObjectURL] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const formValid = title && visibilitySetting && description && thumbnail;

  const isFormValid = () => formValid;

  const handleFileSelect = async (file) => {
    if (thumbnailObjectURL) {
      // revoke old URLs
      window.URL.revokeObjectURL(thumbnailObjectURL);
    }

    if (file && validateThumbnail(file)) {
      setThumbnail(file);
      setThumbnailObjectURL(window.URL.createObjectURL(file));
    } else {
      setThumbnail(null);
      setThumbnailObjectURL(null);
      if (thumbnailObjectURL) {
        window.URL.revokeObjectURL(thumbnailObjectURL);
      }
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    
    if (submitting) return;
    setSubmitting(true);

    if (isFormValid()) {
      onSubmit({ title, visibilitySetting, description, thumbnail });
      onNext(index + 1);
    }
    
    setSubmitting(false);
  };

  useEffect(() => {
    const { title, visibilitySetting, description, thumbnail } =
      platformInputs || {};
    setTitle(title || "");
    setVisibilitySetting(visibilitySetting || "");
    setDescription(description || "");
    setThumbnail(thumbnail || null);
  }, [platformInputs]);

  useEffect(() => {
    return () => {
      if (thumbnailObjectURL) {
        window.URL.revokeObjectURL(thumbnailObjectURL);
      }
    };
  }, [thumbnailObjectURL]);

  useEffect(() => {
    if (thumbnail && !thumbnailObjectURL) {
      // create an object URL for the first render of this component if there
      // was a previous thumbnail
      setThumbnailObjectURL(window.URL.createObjectURL(thumbnail));
    }
  }, [thumbnail, thumbnailObjectURL]);

  return (
    <div className="py-2">
      <form onSubmit={handleSubmit}>
        <div className="w-full xl:w-10/12 flex flex-wrap">
          <div className="w-full xl:w-1/2 px-2 pb-2">
            <RoundedInput
              name="title"
              type="text"
              value={title}
              placeholder="Title"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              required
            />
          </div>
          <div className="w-full xl:w-1/2 px-2 pb-2">
            <Select
              placeholder="Visibility Setting"
              name="visibilitySetting"
              value={visibilitySetting}
              onChange={(e) => setVisibilitySetting(e.target.value)}
              options={visibilitySettingOptions}
              required
            />
          </div>
          <div className="w-full xl:w-1/2 px-2 pb-2">
            <Textarea
              name="description"
              placeholder="Description"
              rows="7"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              required
            />
          </div>
          <div className="w-full xl:w-1/2 px-2 pb-2">
            <Card>
              <CardContent>
                <h5 className="text-sm">Thumbnail</h5>
                <div className="mt-2 grid gap-3 grid-cols-2">
                  <label htmlFor="youtubeThumbnail">
                    <input
                      id="youtubeThumbnail"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                      hidden
                    />
                    <Card>
                      <CardContent className="text-center flex flex-col justify-center items-center">
                        <BrowserIcon className="h-12 w-auto" />
                        <p className="text-xs mt-1">Browse your device</p>
                      </CardContent>
                    </Card>
                  </label>
                  <Card>
                    <CardContent className="text-center flex flex-col justify-center items-center">
                      {thumbnailObjectURL && (
                        <img
                          className="h-12 w-full object-cover"
                          src={thumbnailObjectURL}
                          alt="Youtube thumbnail"
                        />
                      )}
                      <p className="text-xs mt-1">Thumbnail preview</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-between mt-3 items-end">
          <p className="text-xxs">All fields must be completed to continue.</p>

          <button
            disabled={!formValid}
            className={clsx(NEXT_BUTTON_DEFAULT_CLASSNAME, {
              [NEXT_BUTTON_INACTIVE_CLASSNAME]: !formValid,
              [NEXT_BUTTON_ACTIVE_CLASSNAME]: formValid,
            })}
          >
            Next <ArrowRightIcon className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default YouTubePlatformInputs;
