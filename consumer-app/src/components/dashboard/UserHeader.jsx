import React, { useState, useEffect } from "react";
import axios from "axios";
import clsx from "clsx";
import { format } from "date-fns";

import Notifications from "./Notifications";

//icons
import AvatarIcon from "../icons/AvatarIcon";
import BellIcon from "../icons/BellIcon";
import CheckIcon from "../icons/CheckIcon";
import CloseIcon from "../icons/CloseIcon";

export default function UserHeader({ user, memberSince }) {
  const [displayNotifications, setDisplayNotifications] = useState(false);
  const [feedActivity, setFeedActivity] = useState([]);
  const verified = user.active ? true : false;

  const handleNotificationToggle = () => {
    setDisplayNotifications(!displayNotifications);
  };

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

  ///// get activity feeeds from api and show on notifications//
  useEffect(() => {
    getActivityFeed();
  }, []);

  return (
    <>
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
              className="block rounded-full w-15 h-14 object-cover"
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
            since: {memberSince ? format(memberSince, "MMM dd, yyyy") : ""}
          </p>
        </div>
      </div>
      {displayNotifications && <Notifications notifications={feedActivity} />}
    </>
  );
}
