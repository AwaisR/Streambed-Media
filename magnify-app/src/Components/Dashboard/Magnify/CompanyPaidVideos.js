import React, { useEffect, useState } from "react";
import Buttons from "./Buttons";
import Loader from "./Loader";
import "../Overview/overview.css";
import "./magnify.css";
import { useSelector, useDispatch } from "react-redux";
import { magnifyActions } from "../../../store/magnify/action";
export default function CompanyPaidVideos() {
  let token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);
  const state = useSelector((state) => state.Magnify);
  const { UserPosts } = state;
  useEffect(() => {
    dispatch(magnifyActions.getCompaniesPosts(token));
  }, []);
  useEffect(() => {
    if (UserPosts.length) {
      setLoader(false);
    }
  }, [UserPosts]);
  return (
    <div className="magnify-item-outer">
      <div className="magnify-row">
        {UserPosts.length > 0
          ? UserPosts.map((item, i) => {
              if (
                item.info &&
                item.stats &&
                item.privacy === "public" &&
                item.videoprice
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
                      postVideoId={item.VideoId ? item.VideoId : item.videoId}
                    />
                  </div>
                );
              }
            })
          : ""}
      </div>
      {loader ? <Loader /> : ""}
    </div>
  );
}
