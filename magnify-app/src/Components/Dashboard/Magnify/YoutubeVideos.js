import React, { useState, useEffect } from "react";
import Buttons from "./Buttons";
import Loader from "./Loader";
import "../Overview/overview.css";
import "./magnify.css";
import { useSelector, useDispatch } from "react-redux";
import { magnifyActions } from "../../../store/magnify/action";
export default function YoutubeVideos({ handlePaidVideosRecord }) {
  let token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);
  const state = useSelector((state) => state.Magnify);
  const { UserPosts, Load, YouTubePosts } = state;
  useEffect(() => {
    dispatch(magnifyActions.getYouTubeVidoes(token));
  }, []);
  useEffect(() => {
    if (YouTubePosts.length) {
      setLoader(false);
    }
  }, [YouTubePosts]);
  return (
    <div>
      <div className="magnify-item-outer">
        <div className="magnify-row">
          {YouTubePosts.length > 0 ? (
            YouTubePosts.map((item, i) => {
              if (
                item.info &&
                item.stats &&
                item.privacy === "public" &&
                !item.videoprice &&
                !item.delete
              ) {
                let engagement = 0;
                let combineAnylatics =
                  parseInt(item.stats.commentCount) +
                  parseInt(item.stats.likeCount);
                engagement = (combineAnylatics / item.stats.viewCount)
                  .toString()
                  .substring(0, 3);

                return (
                  <div className="magnify-item" key={i}>
                    <div className="magnify-image">
                      <div className="magnify-image">
                        <iframe
                          width="200"
                          height="200"
                          src={`https://www.youtube.com/embed/${
                            item.videoId ? item.videoId : item.VideoId
                          }`}
                        ></iframe>
                        <p className="hover-icon"></p>
                      </div>
                      <p className="hover-icon"></p>
                    </div>
                    <div className="magnify-info">
                      <p>@{item.publisher}</p>
                      <div className="item-status">
                        <div className="item-views">
                          <p>Views</p>
                        </div>
                        <div className="item-pern">
                          <p>
                            {item.stats
                              ? item.stats.viewCount
                                ? item.stats.viewCount
                                : "0"
                              : "0"}
                            {}
                          </p>
                        </div>
                      </div>
                      <div className="item-status no-bg ">
                        <div className="item-views">
                          <p>Engagement</p>
                        </div>
                        <div className="item-pern">
                          <p>
                            {item.stats
                              ? engagement
                                ? engagement === "NaN"
                                  ? "0%"
                                  : `${engagement}%`
                                : "0%"
                              : "0%"}
                            {}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Buttons
                      id={item.id}
                      item={item}
                      handlePaidVideosRecord={handlePaidVideosRecord}
                      postVideoId={item.VideoId ? item.VideoId : item.videoId}
                    />
                  </div>
                );
              }
            })
          ) : (
            <Loader />
          )}
        </div>
        {loader ? <Loader /> : ""}
      </div>
    </div>
  );
}
