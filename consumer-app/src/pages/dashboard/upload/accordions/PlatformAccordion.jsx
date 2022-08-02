import React from "react";
import clsx from "clsx";

// components
import { Card, CardContent } from "../../../../components/layouts/Card";

// icons
import CheckIcon from "../../../../components/icons/CheckIcon";

// utils
import { PLATFORM_ICON_MAP } from "../../../../components/helpers/platforms";

import { NextButton } from "./shared";

const PlatformAccordion = ({
  index,
  platform,
  onChange,
  onNext,
  platforms,
}) => {
  const updateValue = (newValue) => {
    onChange(newValue);
  };

  return (
    <div className="flex justify-between items-end">
      <div className="mt-4 flex flex-wrap space-x-4">
        {platforms.hasRT && (
          <Card onClick={() => updateValue("YouTube")}>
            <CardContent className="relative h-24 w-24 flex items-center justify-center">
              {PLATFORM_ICON_MAP["YouTube"]({
                className: "w-12 h-auto",
              })}
              <CheckIcon
                className={clsx(
                  "absolute text-primary bottom-3 right-3 w-3 h-3",
                  {
                    hidden: platform !== "YouTube",
                  }
                )}
              />
            </CardContent>
          </Card>
        )}

        {platforms.twitterTokens && platforms.twitterTokens.isActive && (
          <Card onClick={() => updateValue("Twitter")}>
            <CardContent className="relative h-24 w-24 flex items-center justify-center">
              {PLATFORM_ICON_MAP["Twitter"]({
                className: "w-12 h-auto",
              })}
              <CheckIcon
                className={clsx(
                  "absolute text-primary bottom-3 right-3 w-3 h-3",
                  {
                    hidden: platform !== "Twitter",
                  }
                )}
              />
            </CardContent>
          </Card>
        )}
        {platforms.instagram && platforms.instagram.access_token && (
          <Card onClick={() => updateValue("Instagram")}>
            <CardContent className="relative h-24 w-24 flex items-center justify-center">
              {PLATFORM_ICON_MAP["Instagram"]({
                className: "w-12 h-auto",
              })}
              <CheckIcon
                className={clsx(
                  "absolute text-primary bottom-3 right-3 w-3 h-3",
                  {
                    hidden: platform !== "Instagram",
                  }
                )}
              />
            </CardContent>
          </Card>
        )}
        {platforms.linkedin && platforms.linkedin.access_token && (
          <Card onClick={() => updateValue("Linkedin")}>
            <CardContent className="relative h-24 w-24 flex items-center justify-center">
              {PLATFORM_ICON_MAP["Linkedin"]({
                className: "w-12 h-auto",
              })}
              <CheckIcon
                className={clsx(
                  "absolute text-primary bottom-3 right-3 w-3 h-3",
                  {
                    hidden: platform !== "Linkedin",
                  }
                )}
              />
            </CardContent>
          </Card>
        )}
        {platforms.facebook && platforms.facebook.access_token && (
          <Card onClick={() => updateValue("Facebook")}>
            <CardContent className="relative h-24 w-24 flex items-center justify-center">
              {PLATFORM_ICON_MAP["Facebook"]({
                className: "w-12 h-auto",
              })}
              <CheckIcon
                className={clsx(
                  "absolute text-primary bottom-3 right-3 w-3 h-3",
                  {
                    hidden: platform !== "Facebook",
                  }
                )}
              />
            </CardContent>
          </Card>
        )}
      </div>

      <NextButton disabled={!platform} onClick={() => onNext(index + 1)}>
        Next
      </NextButton>
    </div>
  );
};

export default PlatformAccordion;
