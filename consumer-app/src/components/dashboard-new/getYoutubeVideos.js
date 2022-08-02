import React, { useState, useEffect } from "react";
import runTheContent from "../helpers/GetToken";
import axios from "axios";
export default () => {
  let videoData = [];
  const localVidData = JSON.parse(sessionStorage.getItem("VideoData"));
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
            console.log("no account linked");
          } else {
            const info = data.items[0].contentDetails.relatedPlaylists.uploads;

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
                videoData = data.items;
                sessionStorage.setItem("VideoData", JSON.stringify(data.items));
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
};
