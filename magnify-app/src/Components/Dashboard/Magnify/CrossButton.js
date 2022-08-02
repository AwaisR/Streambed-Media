import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { magnifyActions } from "../../../store/magnify/action";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";
export default function CrossButton({ item, dropdownName }) {
  let token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const state = useSelector((state) => state.Magnify);
  const { UserPosts, Load } = state;
  const handleRemove = async (data) => {
    setLoading(true);
    if (data.VideoId) {
      await dispatch(magnifyActions.removeCompanyVideo(data.VideoId, token));
    } else {
      dispatch(magnifyActions.removeYouTubeVideo(data.videoId, token));
    }
  };
  useEffect(() => {
    if (!Load) setLoading(false);
  }, [Load]);
  return (
    <div
      className="magnify-cross"
      onClick={(e) => !item.delete && handleRemove(item)}
    >
      <FontAwesomeIcon icon={faTimes} />
      {loading && <Loader width="30px" height="30px" />}
    </div>
  );
}
