import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  UncontrolledPopover,
  Popover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";

function Overview(props) {
  const yt = useSelector((state) => state.youtube);
  const ytVideo = useSelector((state) => state.dashboard.youtubeVideo);
  const [watchMinTime, setWatchMinTime] = useState(0);
  const [totalStatistics, setTotalStatistics] = useState();

  const dashboard = useSelector((state) => state.dashboard);
  const { videoCollaboratorsStatistics, videoCollaborator } = dashboard;

  const [collAnalytics, setCollAnalytics] = useState({
    commentCount: 0,
    dislikeCount: 0,
    favoriteCount: 0,
    likeCount: 0,
    viewCount: 0,
  });

  useEffect(() => {
    let totalWatchTime = 0;
    let totalStattistics = {
      viewCount: 0,
      likeCount: 0,
      dislikeCount: 0,
      favoriteCount: 0,
      commentCount: 0,
    };
    yt.video.forEach((item, i) => {
      if (item.checked) {
        const { stat, statistics } = item;
        if (stat) {
          totalWatchTime =
            totalWatchTime + parseInt(stat.estimatedMinutesWatched);
        }
        if (statistics) {
          totalStattistics.viewCount =
            totalStattistics.viewCount + parseInt(statistics?.viewCount);
          totalStattistics.likeCount =
            totalStattistics.likeCount + parseInt(statistics?.likeCount);
          totalStattistics.dislikeCount =
            totalStattistics.dislikeCount + parseInt(statistics?.dislikeCount);
          totalStattistics.favoriteCount =
            totalStattistics.favoriteCount +
            parseInt(statistics?.favoriteCount);
          totalStattistics.commentCount =
            totalStattistics.commentCount + parseInt(statistics?.commentCount);
        }
      }
    });
    setTotalStatistics(totalStattistics);
    setWatchMinTime(totalWatchTime);
  }, [yt]);

  useEffect(() => {
    let stat = {
      commentCount: 0,
      dislikeCount: 0,
      favoriteCount: 0,
      likeCount: 0,
      viewCount: 0,
    };

    videoCollaboratorsStatistics.forEach((item) => {
      const { statistics, selected } = item;
      if (selected) {
        stat.commentCount =
          stat.commentCount + parseInt(statistics.commentCount);
        stat.dislikeCount =
          stat.dislikeCount + parseInt(statistics.dislikeCount);
        stat.favoriteCount =
          stat.favoriteCount + parseInt(statistics.favoriteCount);
        stat.likeCount = stat.likeCount + parseInt(statistics.likeCount);
        stat.viewCount = stat.viewCount + parseInt(statistics.viewCount);
      }
    });
    setCollAnalytics(stat);
  }, [videoCollaboratorsStatistics]);

  const { memberSince } = props;

  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  return (
    <ul className="dashboard-grid">
      <li className="newviews-box">
        <button
          id="yourPosts"
          type="button"
          className="fa fa-question-circle-o questionMark"
        ></button>
        <UncontrolledPopover
          trigger="focus"
          placement="bottom"
          target="yourPosts"
        >
          <PopoverHeader className="popoverTitle">Your Posts</PopoverHeader>
          <PopoverBody className="popoverContent">
            Go you! This is the total amount of posts you've made on all
            platforms!{" "}
          </PopoverBody>
        </UncontrolledPopover>
        <div>
          <img
            alt="original"
            className="overview-icon"
            src={require("../../assets/images/icons/original-content.svg")}
          />
          <label className="overview-text">Your Posts</label>
        </div>
        <div>
          <label className="overview-figure">
            {ytVideo ? ytVideo.length : 0}
          </label>
          {/* <label className="overview-post">Posts</label> */}
        </div>
      </li>

      <li className="newviews-box">
        <button
          id="yourReach"
          type="button"
          className="fa fa-question-circle-o questionMark"
        ></button>
        <UncontrolledPopover
          trigger="focus"
          placement="bottom"
          target="yourReach"
        >
          <PopoverHeader className="popoverTitle">Your Reach</PopoverHeader>
          <PopoverBody className="popoverContent">
            Look how far your content has travelled! This is the combined reach
            of all your content across all connected platforms.
          </PopoverBody>
        </UncontrolledPopover>
        <div>
          <img
            alt="owned reach"
            className="overview-icon"
            src={require("../../assets/images/icons/owned-reach.svg")}
          />
          <label className="overview-text">Your Reach</label>
        </div>
        <div>
          <label className="overview-figure">
            {totalStatistics ? parseInt(totalStatistics.viewCount) : 0}
          </label>
        </div>
      </li>

      <li className="newviews-box">
        <button
          id="postEngagement"
          type="button"
          className="fa fa-question-circle-o questionMark"
        ></button>
        <UncontrolledPopover
          trigger="focus"
          placement="bottom"
          target="postEngagement"
        >
          <PopoverHeader className="popoverTitle">
            Post Engagement
          </PopoverHeader>
          <PopoverBody className="popoverContent">
            People really love what you're doing! This is your total likes,
            comments and retweets across your posts.
          </PopoverBody>
        </UncontrolledPopover>
        <div>
          <img
            alt="engagement"
            className="overview-icon"
            src={require("../../assets/images/icons/engagement.svg")}
          />
          <label className="overview-text">Post Engagement</label>
        </div>
        <div>
          <label className="overview-figure">
            {totalStatistics ? parseInt(totalStatistics.commentCount) : 0}
          </label>
          {/* <label className="overview-post">+2.5% from last week</label> */}
        </div>
      </li>

      <li className="newviews-box">
        <button
          id="collaborations"
          type="button"
          className="fa fa-question-circle-o questionMark"
        ></button>
        <UncontrolledPopover
          trigger="focus"
          placement="bottom"
          target="collaborations"
        >
          <PopoverHeader className="popoverTitle">Contributions</PopoverHeader>
          <PopoverBody className="popoverContent">
            Wow! This is the total amount of posts you've been tagged and
            verified in.
          </PopoverBody>
        </UncontrolledPopover>
        <div>
          <img
            alt="overview"
            className="overview-icon"
            src={require("../../assets/images/icons/contributed.svg")}
          />
          <label className="overview-text">Contributions</label>
        </div>
        <div>
          <label className="overview-figure">
            {videoCollaborator || ytVideo
              ? (videoCollaborator ? videoCollaborator.length : 0) +
                (ytVideo ? ytVideo.length : 0)
              : 0}
          </label>
        </div>
      </li>

      <li className="newviews-box">
        <button
          id="collaborationReach"
          type="button"
          className="fa fa-question-circle-o questionMark"
        ></button>
        <UncontrolledPopover
          trigger="focus"
          placement="bottom"
          target="collaborationReach"
        >
          <PopoverHeader className="popoverTitle">
            Contribution Reach
          </PopoverHeader>
          <PopoverBody className="popoverContent">
            Teamwork makes the dream work! This is the combined reach of all
            your verified contributions across all your connected platforms.
          </PopoverBody>
        </UncontrolledPopover>

        <div>
          <img
            alt="contribution"
            className="overview-icon"
            src={require("../../assets/images/icons/contribution-reach.svg")}
          />
          <label className="overview-text">Contribution Reach</label>
        </div>
        <div>
          <label className="overview-figure">
            {/* TODO! ensure this is working fine, quotat end now */}
            {parseInt(collAnalytics.viewCount) +
              (totalStatistics ? parseInt(totalStatistics.viewCount) : 0)}
          </label>
        </div>
      </li>

      <li className="newviews-box">
        <button
          id="postShares"
          type="button"
          className="fa fa-question-circle-o questionMark"
        ></button>
        <UncontrolledPopover
          trigger="focus"
          placement="bottom"
          target="postShares"
        >
          <PopoverHeader className="popoverTitle">Post Shares</PopoverHeader>
          <PopoverBody className="popoverContent">
            Sharing is caring! This is the total amount of shares you've
            received across all platforms.
          </PopoverBody>
        </UncontrolledPopover>
        <div>
          <img
            alt="clickthrough"
            className="overview-icon"
            src={require("../../assets/images/icons/clickthrough.svg")}
          />
          <label className="overview-text">Post Shares</label>
        </div>
        <div>
          <label className="overview-figure">
            {" "}
            {totalStatistics ? parseInt(totalStatistics.likeCount) : 0}
          </label>
        </div>
      </li>
      <li className="newviews-box">
        {/* <button id="userSince" type="button" className="fa fa-question-circle-o questionMark"></button>
      <UncontrolledPopover trigger="focus" placement="bottom" target="userSince">
        <PopoverHeader className="popoverTitle">Popover Title</PopoverHeader>
        <PopoverBody className="popoverContent">Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
      </UncontrolledPopover> */}
        <div>
          <img
            alt="user since"
            className="overview-icon userSince"
            src={require("../../assets/images/icons/user-since.svg")}
          />
          <label className="overview-text userSince">User Since</label>
        </div>
        <div>
          <div className="mt-sm-2">
            <label className="user-since-date mb-0">
              {memberSince
                ? moment(memberSince).format("MMM D")
                : moment(new Date()).format("MM DD")}
            </label>
            <label className="user-since-year">
              {" "}
              {memberSince
                ? moment(memberSince).format("YYYY")
                : moment(new Date()).format("YYYY")}
            </label>
          </div>
        </div>
      </li>
      <li className="newviews-box">
        {/* <button id="watch" type="button" className="fa fa-question-circle-o questionMark"></button>
      <UncontrolledPopover trigger="focus" placement="bottom" target="watch">
        <PopoverHeader className="popoverTitle">Popover Title</PopoverHeader>
        <PopoverBody classname="popoverContent">Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
      </UncontrolledPopover> */}
        <div>
          <img
            alt="watch time"
            className="overview-icon"
            src={require("../../assets/images/icons/watch-time.svg")}
          />
          <label className="overview-text">Watch Time</label>
        </div>
        <div>
          <label className="overview-figure"> {watchMinTime}m</label>
        </div>
      </li>
      <li className="newviews-box">
        <button
          id="reverb"
          type="button"
          className="fa fa-question-circle-o questionMark"
        ></button>
        <UncontrolledPopover trigger="focus" placement="bottom" target="reverb">
          <PopoverHeader className="popoverTitle">REVERB SCORE</PopoverHeader>
          <PopoverBody className="popoverContent">
            This number is unique to Streambed. It takes into account several
            underlying insights and analytics native to individual social media
            platforms. We also use blockchain driven verification across
            multiple social media platforms to validate your online value in an
            indisputable way.
          </PopoverBody>
        </UncontrolledPopover>
        <div>
          <img
            alt="reverb-score"
            className="overview-icon"
            src={require("../../assets/images/icons/reverb-score.svg")}
          />
          <label className="overview-text">Reverb Score</label>
        </div>
        <div>
          <label className="overview-figure">N/A</label>
          {/* <label className="overview-post">+100 from last week</label> */}
        </div>
      </li>
    </ul>
  );
}

export default Overview;
