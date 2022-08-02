import React, { useEffect, useMemo, memo, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { styled } from "twin.macro";

import { Card, CardContent } from "../layouts/Card";

import EditIcon from "../icons/EditIcon";

import { formatNumberWithCommas } from "../../helpers/helper";
import { PLATFORM_ICON_MAP } from "../helpers/platforms";

import { PADDING_Y } from "../../pages/dashboard/shared/MainContent";
import UserHeader from "./UserHeader";
import { Link } from "react-router-dom";
const Container = styled.div`
  box-shadow: 0 3px 10px rgba(0, 55, 74, 0.1);
`;

const OverviewSidebar = ({
  user,
  memberSince,
  className,
  totalPosts,
  channelName,
  linkedin,
  facebook,
  twitter,
  zoomData,
  instagram,
  videoCollaborator,
}) => {
  const accounts = [
    {
      platform: "YouTube",
      username: channelName && channelName ? channelName : "",
      linked: channelName ? true : true,
    },
    {
      platform: "Twitter",
      username: twitter ? twitter.screen_name : "Twitter",
      linked: twitter ? twitter.oauth_token : false,
    },
    {
      platform: "Zoom",
      username: zoomData?.zoom_rT
        ? zoomData.first_name + " " + zoomData.last_name
        : "zoom",
      linked: zoomData ? true : false,
    },
    {
      platform: "Instagram",
      username: instagram?.first_name
        ? `${instagram?.first_name}  ${instagram?.last_name}`
        : "Instagram",
      linked: instagram ? true : false,
    },
    {
      platform: "Facebook",
      username: facebook?.first_name
        ? `${facebook?.first_name}  ${facebook?.last_name}`
        : "Facebook",
      linked: facebook ? true : false,
    },
    {
      platform: "TikTok",
      username: "MereGrey20",
      linked: false,
    },
    {
      platform: "Linkedin",
      username: linkedin?.first_name
        ? `${linkedin?.first_name}  ${linkedin?.last_name}`
        : "LinkedIn",
      linked: linkedin ? true : false,
    },
  ];
  const [collaborationsCount, setCollaborationsCount] = useState(0);

  useEffect(() => {
    setCollaborationsCount(
      videoCollaborator || totalPosts
        ? (videoCollaborator ? videoCollaborator.length : 0) +
            (totalPosts ? totalPosts.length : 0)
        : 0
    );
  }, [videoCollaborator, totalPosts]);

  const AccountsSection = useMemo(() => (
    <div className="grid grid-cols-2 gap-2">
      {accounts.map(({ platform, username, linked }) => (
        <Card key={platform}>
          <CardContent className="flex flex-col justify-center items-center space-y-2">
            {PLATFORM_ICON_MAP[platform]({ className: "w-20 h-8" })}
            {linked ? (
              <span className="text-sm text-primary">{username}</span>
            ) : (
              <span className="text-sm text-gray-300">Not linked</span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
    // eslint-disable-next-line
  ));

  return (
    <Container className={clsx("w-full min-h-screen bg-white", className)}>
      <div className={clsx("relative px-6", PADDING_Y)}>
        {/* Header */}
        <UserHeader user={user} memberSince={memberSince} />

        <hr className="my-4" />

        {/* Posts and Collabs */}
        <div className="flex space-x-2">
          <div className="w-1/2">
            <h3 className="text-lg text-copy">Your Posts</h3>
            <Card className="mt-2 bg-white">
              <CardContent className="text-center">
                <span className="text-primary font-semibold text-2xl">
                  {totalPosts ? totalPosts.length : 0}
                  {/* {formatNumberWithCommas(postsCount)} */}
                </span>
              </CardContent>
            </Card>
          </div>
          <div className="w-1/2">
            <h3 className="text-lg text-copy">Collaborations</h3>
            <Card className="mt-2 bg-white">
              <CardContent className="text-center">
                <span className="text-primary font-semibold text-2xl">
                  {formatNumberWithCommas(collaborationsCount)}
                </span>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-between mt-8 mb-2">
          <h3 className="text-lg text-copy">Linked Accounts</h3>
          <Link to="/profile/linked-accounts">
            <EditIcon />
          </Link>
        </div>

        {AccountsSection}

        {/* <h3 className="text-lg text-copy mt-8 mb-2">Reverb Score</h3> */}

        {/* <Card className="bg-white">
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-2 items-center">
              <div className="text-3xl text-copy font-medium">
                {formatNumberWithCommas(26843)}
              </div>
              <div>
                <h6 className="text-sm text-copy font-light">Past week</h6>
                <div className="flex items-end mt-0">
                  <ArrowIcon
                    className={clsx("text-sm transform fill-current mb-1", {
                      "text-secondary": false,
                      "rotate-180 text-primary": true,
                    })}
                  />
                  <span className="ml-1 text-base text-copy font-medium">
                    {1.98}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between">
                <span className="text-xs text-gray-300">0</span>
                <span className="text-xs text-gray-300">48,449</span>
              </div>
              <div className="w-full relative border p-1 rounded-2xl shadow-md">
                <div className="w-full h-5 rounded-xl bg-gradient-to-r from-primary to-primary-dark"></div>
                <div className="absolute top-0 left-3/4 h-9 -mt-1 w-2 bg-white border rounded-xl shadow-md"></div>
              </div>
            </div>

            <p className="text-copy text-sm">
              Reverb Score is a Streambed OG metric that measures the overall
              impact you have with your social media footprint. This indicator
              is a good way to see how much influence you have compared to
              others across all platforms with a single aggregated number.
            </p>
          </CardContent>
        </Card> */}
      </div>
    </Container>
  );
};

OverviewSidebar.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired,
  // memberSince: PropTypes.string,
};

export default memo(OverviewSidebar);
