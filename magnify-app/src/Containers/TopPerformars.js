import React, { useEffect, useState } from "react";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import logo from "../../src/assests/images/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { magnifyActions } from "../store/magnify/action";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";
import { useHistory } from "react-router-dom";
export default function TopPerformars() {
  let history = useHistory();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);
  const state = useSelector((state) => state.Magnify);
  const { UserPosts } = state;
  const [topPerformars, setTopPerformars] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    dispatch(magnifyActions.getYouTubeVidoes(token));
  }, []);
  useEffect(() => {
    const tempViews = [];
    if (UserPosts.length) {
      UserPosts.forEach((element) => {
        if (element.info && element.privacy === "public") {
          let obj = {};
          obj.view = element.stats.viewCount;
          obj.thumbnails = element.info.thumbnails.high.url;
          tempViews.push(obj);
        }
      });
      const topViews = tempViews
        .sort(function (a, b) {
          return parseFloat(a.view) - parseFloat(b.view);
        })
        .reverse()
        .slice(0, 9);

      setTopPerformars(topViews);
      setLoader(false);
    }
  }, [UserPosts]);
  return (
    <div>
      <div className="graph-box">
        <div className="box-heading">
          <div className="title">
            <h4>Top Performers</h4>
            <p>
              Your top performers based on the analytics you have purchased from
              those content creators
            </p>
          </div>
          <div className="box-selector">
            <a href="">
              <FontAwesomeIcon icon={faEye} />
            </a>
          </div>
        </div>
        {loader ? <Loader /> : ""}
        <div className="performer-list">
          {topPerformars.length
            ? topPerformars.map((view) => (
                <div className="list-img">
                  <img
                    src={view.thumbnails}
                    onClick={() => history.push("/dashboard/magnify")}
                  />
                </div>
              ))
            : ""}
        </div>
      </div>
    </div>
  );
}
