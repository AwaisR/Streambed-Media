import React, { useState, useEffect } from "react";
import "./stream.css";

import axios from "axios";
import ContentTwitterItem from "./ContentTwitterItem";

const ContentTwitterStream = (props) => {
  const [loading, setLoading] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [collaboratorTweets, setCollaboratorTweets] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/twitter/get-user-post", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setLoading(false);
        setTweets(res.data._posts);
      })
      .catch((error) => {
        setLoading(false);

        if (error.response) {
          // The request was made and the server responded with a status
          console.log(error.response);
        } else if (error.request) {
          // The request was made but no response was received

          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log("Something went wrong", error.config);
      });

    axios
      .get("/api/twitter/get-collaborators", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setLoading(false);
        setCollaboratorTweets(res.data.collaborators);
      })
      .catch((error) => {
        setLoading(false);

        if (error.response) {
          // The request was made and the server responded with a status
          console.log(error.response);
        } else if (error.request) {
          // The request was made but no response was received

          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log("Something went wrong", error.config);
      });
  }, []);

  if (loading) {
    return (
      <div className="content-loader">
        <img
          alt="content-loader"
          src={require("~/assets/images/content-loader.svg")}
        />
      </div>
    );
  }
  return (
    <div className="overview-root pl-2-5 flexcroll ">
      <div className="pr-1">
        <div className="new-check d-flex justify-content-between pr-3 flex-wrap">
          <div className="select-all d-flex">
            <div className="mr-3">
              <label className="checkmark-parent position-relative">
                <input
                  type="checkbox"
                  id="selectAll"
                  onChange={() => console.log("")}
                  checked={true}
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="content-select">
              <label>Select All</label>
            </div>
          </div>
          <div className="filter-group">
            <input
              placeholder="Filter content"
              className="filter-textbox"
              type="text"
              onChange={() => console.log("call filter options")}
            />
          </div>
        </div>

        {tweets?.map((item) => {
          return <ContentTwitterItem item={item} key={item.id_str} />;
        })}

        {collaboratorTweets?.map((item) => {
          const {
            user,
            text,
            id_str,
            created_at,
            entities: { media },
          } = item.post;
          return (
            <ContentTwitterItem
              item={item.post}
              role={item.role}
              owner={item.owner}
              key={id_str}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ContentTwitterStream;
