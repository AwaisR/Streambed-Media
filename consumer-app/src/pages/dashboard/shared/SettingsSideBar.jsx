import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { styled } from "twin.macro";
import axios from "axios";
import { Card, CardContent } from "../../../components/layouts/Card";
import Notifications from "../../../components/dashboard/Notifications";

// import ArrowIcon from "../icons/ArrowIcon";
import AvatarIcon from "../../../components/icons/AvatarIcon";
import BellIcon from "../../../components/icons/BellIcon";
import CheckIcon from "../../../components/icons/CheckIcon";
import CloseIcon from "../../../components/icons/CloseIcon";
import BackUpAccountDetails from "../Settings/BackUpAccountDetails";
import DeactivateDetails from "../Settings/DeactivateDetails";
import ResetPassword from "../Settings/ResetPassword";
import AddEmails from "../Settings/AddEmail";
import EditEmails from "../Settings/EditEmails";
import moment from "moment";

import { PADDING_Y } from "../../dashboard/shared/MainContent";

const Container = styled.div`
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  box-shadow: 0 3px 10px rgba(0, 55, 74, 0.1);
`;

const SettingsSideBar = ({
  user,
  memberSince,
  className,
  addEmail,
  showContent,
}) => {
  // const [notifications, setNotifications] = useState([]);
  const [displayNotifications, setDisplayNotifications] = useState(false);
  const [feedActivity, setFeedActivity] = useState([]);
  const verified = user.active ? true : false;
  const handleNotificationToggle = () => {
    setDisplayNotifications(!displayNotifications);
  };
  ///// get activity feeeds from api and show on notifications//
  useEffect(() => {
    getActivityFeed();
  }, []);

  const getActivityFeed = async () => {
    try {
      const { data } = await axios.get("/api/activityfeed", {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      setFeedActivity(data);
    } catch (error) {
      console.error("An error occured while fetching activity feed");
    }
  };

  // useEffect(() => {
  //   setNotifications([
  //     {
  //       message: "Meredith was tagged in @ChristinaYang's YouTube video",
  //       createdAt: new Date(),
  //     },
  //     {
  //       message: "Meredith was tagged in @GeorgeOMally's tweet",
  //       createdAt: new Date(),
  //     },
  //     { message: "Meredith posted a new YouTube video", createdAt: new Date() },
  //   ]);
  // }, []);
  const renderContent = () => {
    switch (showContent) {
      case "BackupAccount":
        return <BackUpAccountDetails />;
        break;
      case "Deactivate-account":
        return <DeactivateDetails />;
        break;
      case "ChangePassword":
        return <ResetPassword />;
      case "addEmails":
        return <AddEmails />;
      case "EditEmails":
        return <EditEmails />;
      default:
        break;
    }
  };
  return (
    <Container className={clsx("w-full min-h-screen bg-white", className)}>
      <div className={clsx("relative px-6", PADDING_Y)}>
        {/* Header */}
        <div className="flex">
          <div className="relative h-14">
            {user.profileImage ? (
              <img
                src={
                  user.profileImage
                    ? process.env.REACT_APP_URL + user.profileImage
                    : ""
                }
                // className={clsx("w-14 h-14", { "text-primary": verified })}
                className="block rounded-full w-16 h-14 object-cover"
                alt="profileImage"
              />
            ) : (
              <AvatarIcon
                className={clsx("w-14 h-14", { "text-primary": verified })}
              />
            )}
            <div className="absolute bottom-0 right-0">
              {verified ? (
                <CheckIcon className="text-primary-dark w-4 h-4" />
              ) : (
                <CloseIcon className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="pl-2 text-gray-400 w-full">
            <div className="flex justify-between">
              <div className="">
                <p className="text-sm">Hello,</p>
                <p className="text-xl text-copy tracking-wide">
                  {user.displayName}
                </p>
              </div>
              <div
                className="relative w-8 h-8 cursor-pointer"
                onClick={handleNotificationToggle}
              >
                <BellIcon className="w-8 h-8" />
                <div className="absolute top-0 right-0 w-4 h-4 bg-primary flex items-center justify-center rounded-full">
                  <span className="text-xs text-white">
                    {feedActivity.length}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs">
              <span className="text-primary">@{user.displayName}</span> | User
              since:{moment(memberSince).format("LL")}
              {/* since: {format(memberSince, "MMM dd, yyyy")} */}
            </p>
          </div>
        </div>
        {displayNotifications && <Notifications notifications={feedActivity} />}

        <hr className="my-4" />

        <Card className="flex-1 flex flex-col justify-between cardsidebar">
          <CardContent className="relative h-full">
            <div className="space-y-2">{renderContent()}</div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

SettingsSideBar.propTypes = {
  className: PropTypes.string,
  // user: PropTypes.object.isRequired,
  // memberSince: PropTypes.object.isRequired,
};

export default SettingsSideBar;
