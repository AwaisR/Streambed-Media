import React, { useEffect, useState } from "react";
import "../Overview/overview.css";
import "./magnify.css";
import image from "../../../assests/images/image.png";
import cross from "../../../assests/images/cross.svg";
import heart from "../../../assests/images/heart.svg";
import { useSelector, useDispatch } from "react-redux";
import RightBarMagnify from "./RightBarMagnify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { magnifyActions } from "../../../store/magnify/action";
import Buttons from "./Buttons";
import Loader from "./Loader";
import Sidebar from "Components/Dashboard/Sidebar/Sidebar";
import Filter from "./Filter";
import FavoritesVideo from "./FavoritesVideo";
import YoutubeVideos from "./YoutubeVideos";
import DeleteVideo from "./DeleteVideo";
import AllPaidVideos from "./AllPaidVideos";
const Magnify = () => {
  let token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const state = useSelector((state) => state.Magnify);
  const [favourites, setFavorites] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  const [dropdownName, setDropdownName] = useState("Company Videos");
  const [likeCount, setLikeCount] = useState(0);
  const [priceSelect, setPriceSelect] = useState("0");
  const [paidPrice, setPaidPrice] = useState(0);
  const [youtubeVidoesPaid, setYouTubeVidoesPaid] = useState([]);
  const [companyVideosPaid, setCompanyVideosPaid] = useState([]);
  const [loader, setLoader] = useState(true);
  const { UserPosts, AllTransactions, Load } = state;
  useEffect(() => {
    setLikeCount(0);
    setPriceSelect("0");
    setCompanyVideosPaid([]);
    setYouTubeVidoesPaid([]);
  }, [AllTransactions]);
  const handlefilter = (name) => {
    setDropdownName(name);
    switch (name) {
      case "YouTube":
        setLikeCount(0);
        setPriceSelect("0");
        setCompanyVideosPaid([]);
        setYouTubeVidoesPaid([]);
        dispatch(magnifyActions.EmptyUserPosts());
        break;
      case "Company Videos":
        setLikeCount(0);
        setPriceSelect("0");
        setCompanyVideosPaid([]);
        setYouTubeVidoesPaid([]);
        dispatch(magnifyActions.EmptyUserPosts());
        dispatch(magnifyActions.getCompaniesPosts(token));
        break;
      case "Show favourite":
        setLikeCount(0);
        setPriceSelect("0");
        setCompanyVideosPaid([]);
        setYouTubeVidoesPaid([]);
        dispatch(magnifyActions.EmptyUserPosts());
        break;
      case "Show Deleted":
        setLikeCount(0);
        setCompanyVideosPaid([]);
        setYouTubeVidoesPaid([]);
        break;
      case "Show Paid Videos":
        setLikeCount(0);
        setPriceSelect("0");
        setCompanyVideosPaid([]);
        setYouTubeVidoesPaid([]);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    dispatch(magnifyActions.getCompaniesPosts(token));
    dispatch(magnifyActions.getTransaction(token));
  }, []);
  useEffect(() => {
    if (UserPosts.length) {
      setLoader(false);
    }
  }, [UserPosts]);
  const handlePaidVideosRecord = (item) => {
    if (item.videoId) {
      let videosId = [...youtubeVidoesPaid];
      if (videosId.indexOf(item.videoId.toString()) === -1) {
        videosId.push(item.videoId.toString());
      }
      setLikeCount(likeCount + 1);
      setPriceSelect(+priceSelect + 505);
      setYouTubeVidoesPaid(videosId);
    } else {
      let videosId = [...companyVideosPaid];
      if (videosId.indexOf(item.VideoId.toString()) === -1) {
        videosId.push(item.VideoId.toString());
      }
      setLikeCount(likeCount + 1);
      setPriceSelect(+priceSelect + 505);
      setCompanyVideosPaid(videosId);
    }
  };
  const RenderPlateFormsVideos = () => {
    switch (dropdownName) {
      case "Company Videos":
        return YouTubeVideo();
        break;
      case "YouTube":
        return (
          <YoutubeVideos handlePaidVideosRecord={handlePaidVideosRecord} />
        );
        break;
      case "Show favourite":
        return (
          <FavoritesVideo handlePaidVideosRecord={handlePaidVideosRecord} />
        );
        break;
      case "Show Deleted":
        return <DeleteVideo handlePaidVideosRecord={handlePaidVideosRecord} />;
        break;
      case "Show Paid Videos":
        return <AllPaidVideos />;
        break;
      default:
    }
  };
  const YouTubeVideo = () => {
    return (
      <div className="magnify-item-outer">
        <div className="magnify-row">
          {UserPosts.length > 0 ? (
            UserPosts.map((item, i) => {
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
    );
  };
  return (
    <>
      <Sidebar />
      <div className="main-outer magnify-outer">
        <div className="main-contant">
          {/*main-heading */}
          <div className="main-heading">
            <div className="title">
              <h1>Magnify</h1>
            </div>
          </div>
          {/* magnify-box */}
          <div className="magnify-box-outer">
            <div className="box-heading">
              <div className="title">
                <p>
                  Review posts that your company has been tagged in via
                  Streambed and has your tags present in the description. Pay
                  each post individually or like the post you wish to pay from
                  your campaign budget and pay all at once from the side panel.
                </p>
              </div>
              <Filter dropdownName={dropdownName} handlefilter={handlefilter} />
            </div>
            {RenderPlateFormsVideos()}
          </div>
        </div>

        <RightBarMagnify
          favourites={favourites}
          priceSelect={priceSelect}
          paidPrice={paidPrice}
          youtubeVidoesPaid={youtubeVidoesPaid}
          companyVideosPaid={companyVideosPaid}
          likeCount={likeCount}
        />
      </div>
    </>
  );
};
export default Magnify;
