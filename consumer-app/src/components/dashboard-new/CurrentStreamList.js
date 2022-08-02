import React, { useState, useEffect } from "react";
import CurrentStreamItem from "./CurrentStreamItem";
import runTheContent from "../helpers/GetToken";
function CurrentStreamList() {
  const [youtubeVideoList, setYoutubeVideList] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [youtube, setYoutube] = useState({});
  useEffect(() => {
    let videoData = [];
    // const localVidData = JSON.parse(sessionStorage.getItem("VideoData"));
    /***********Function to fetch Video List */
    const getVideoList = () => {
      runTheContent((accessToken) => {
        if (!accessToken || accessToken === "undefined") return;

        fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true&maxResults=50&type=video&key=${
            process.env.REACT_APP_APIKEY
          }&_=${Math.random()}`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
            } else {
              const info =
                data.items[0].contentDetails.relatedPlaylists.uploads;

              fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${info}&key=${process.env.REACT_APP_APIKEY}`,
                {
                  method: "GET",
                  headers: {
                    "Content-type": "application/json",
                    Authorization: "Bearer " + accessToken,
                  },
                }
              )
                .then((response) => response.json())
                .then((data) => {
                  setYoutube(data.items);
                  videoData = data.items;
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            }
          });
      });

      return videoData;
    };
    getVideoList();
  }, []);
  const singleCheck = (e) => {
    const items = [...youtubeVideoList];
    items.forEach((item) => {
      if (e.target.value === item.videoId) {
        item.checked = !item.checked;
      }
      if (!item.checked) {
        setCheckedAll(false);
      }
    });
    setYoutubeVideList(items);
  };
  const checkAll = () => {
    const items = [...youtubeVideoList];
    items.forEach((item) => {
      if (checkedAll) {
        item.checked = false;
      } else {
        item.checked = true;
      }
    });
    setYoutubeVideList(items);
    setCheckedAll(!checkedAll);
  };

  useEffect(() => {
    let tempVideoList = [];
    if (youtube) {
      if (youtube.length > 0) {
        youtube.forEach((item) => {
          let obj = {};
          obj.plateform = "YouTube";
          obj.thumbnails = item.snippet.thumbnails;
          obj.title = item.snippet.title;
          obj.videoId = item.snippet.resourceId.videoId;
          obj.checked = false;

          tempVideoList.push(obj);
        });
        setYoutubeVideList(tempVideoList);
      }
    }
  }, [youtube]);

  if (!youtube) {
    return (
      <div className="videos-section">
        <div className="videos-inner">link account first</div>
      </div>
    );
  }
  return (
    <div className="overview-root flexcroll">
      <div className="videos-inner">
        <div className="form-group form-check">
          <input
            type="checkbox"
            id="selectAll"
            onChange={() => checkAll()}
            checked={checkedAll}
          />
          <label htmlFor="selectAll">Select All</label>
        </div>
      </div>
      <div className="videos-wrap">
        <div className="video-boxes">
          {youtubeVideoList.map((item) => {
            return (
              <CurrentStreamItem
                key={item.videoId}
                title={item.title}
                videoId={item.videoId}
                checked={item.checked}
                singleCheck={singleCheck}
                plateform={item.plateform}
                thumbnails={item.thumbnails}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CurrentStreamList;
