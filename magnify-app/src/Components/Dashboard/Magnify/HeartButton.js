import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { magnifyActions } from "../../../store/magnify/action";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";
export default function HeartButton({ item }) {
  let token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const state = useSelector((state) => state.Magnify);
  const { UserPosts, Load } = state;
  const handlefav = (data) => {
    setLoading(true);
    runningLoader(data);
    if (item.videoId) {
      if (!item.fevorite) {
        let obj = {
          videoId: item.videoId,
          token: token,
          favourite: true,
        };
        dispatch(magnifyActions.addYouTubeFavouriteVideo(obj));
      } else {
        let obj = {
          videoId: item.videoId,
          token: token,
          favourite: false,
        };
        dispatch(magnifyActions.addYouTubeFavouriteVideo(obj));
      }
    } else {
      if (!item.fevorite) {
        let obj = {
          videoId: item.VideoId,
          token: token,
          favourite: true,
        };
        dispatch(magnifyActions.addCompanyFavouriteVideo(obj));
      } else {
        let obj = {
          videoId: item.VideoId,
          token: token,
          favourite: false,
        };
        dispatch(magnifyActions.addCompanyFavouriteVideo(obj));
      }
    }
  };
  const runningLoader = (data) => {
    return (
      loading && (
        <Loader
          width="34px"
          height="34px"
          color={item.fevorite ? "#FFF" : "#56123d"}
          borderRightColor="transparent"
        />
      )
    );
  };
  useEffect(() => {
    if (!Load) setLoading(false);
  }, [Load]);
  return (
    <div
      className={`${item.fevorite ? "magnify-heart active" : "magnify-heart"}`}
      onClick={(e) => !item.delete && handlefav(item)}
    >
      <FontAwesomeIcon icon={faHeart} />
      {runningLoader()}
    </div>
  );
}
