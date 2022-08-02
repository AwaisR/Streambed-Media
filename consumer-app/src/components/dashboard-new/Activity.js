import React, { useEffect, useState } from "react";
import { socket } from "../helpers/socket";
import axios from "axios";
import moment from "moment";
const Activity = () => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    socket.on("activity_feed", (data) => {
      addNewActivity(data);
    });
  });

  const addNewActivity = (data) => {
    const activityState = [data, ...feed];
    setFeed(activityState);
  };

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
      setFeed(data);
    } catch (error) {
      console.error("An error occured while fetching activity feed");
    }
  };

  return (
    <div className="overview-root flexcroll">
      {feed?.map((item, i) => (
        <a
          key={`activity-card-${i}`}
          href={
            item?.activity?.platform.toLowerCase() == "facebook"
              ? `http://www.streambedmedia.com/content-stag?facebook_post=${item.activity?.userVideoId}&txid=${item.video?.txid}`
              : item?.activity?.platform.toLowerCase() == "instagram"
              ? `http://www.streambedmedia.com/content-stag?insta_post=${item.activity?.userVideoId}&txid=${item.video?.txid}`
              : `http://www.streambedmedia.com/content-stag?v_id=${item.activity?.userVideoId}`
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="activity-card">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center justify-content-between">
                <div className="activity-logo-parent">
                  <img
                    alt="profile"
                    className="activity-logo"
                    src={require("../../assets/images/icons/profile-avatar.svg")}
                  />
                </div>
                <div className="activity-status">
                  <h6 className="activity-detail">
                    {" "}
                    <strong>
                      {item?.activity.userName
                        ? item?.activity.userName
                        : item?.user?.displayName}
                    </strong>{" "}
                    {item?.activity.activity
                      ? item?.activity.activity
                      : "posted a video to"}{" "}
                    {item?.activity.activity ? (
                      <strong className="">{item?.activity.platform}</strong>
                    ) : (
                      <strong className="">
                        {item?.activity.platform == "youtube"
                          ? "YouTube"
                          : "YouTube"}
                      </strong>
                    )}
                  </h6>
                  <div>
                    <label className="activity-date">
                      {moment(item?.activity?.createdAt).format("MMM Do YYYY")}
                    </label>
                    <label className="activity-time">
                      {moment(item?.activity?.createdAt).format("HH:mm ")}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {item?.activity?.platform.toLowerCase() == "facebook" ? (
              <i className="fab fa-facebook-f"></i>
            ) : (
              ""
            )}
            {item?.activity?.platform.toLowerCase() == "linkedin" ? (
              <i class="fab fa-linkedin" style={{ marginRight: "20px" }}></i>
            ) : (
              <img
                alt="plateform icon"
                className="activity-icons"
                src={require(`~/assets/images/icons/${item?.activity?.platform.toLowerCase()}-outline.svg`)}
              />
            )}
          </div>
        </a>
      ))}
    </div>
  );
};
export default Activity;
