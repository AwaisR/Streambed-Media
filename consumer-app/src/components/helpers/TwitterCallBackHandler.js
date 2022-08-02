import React, { useEffect, useState } from "react";
import qs from "query-string";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Loader from "../shared/Loader";
function TwitterCallBackHandler(props) {
  let location = useLocation();
  const [loading, setLoading] = useState(true);
  const { oauth_token, oauth_verifier } = qs.parse(location.search);
  const token = window.localStorage.getItem("token");
  const url = "/api/twitter-callback";

  useEffect(() => {
    axios
      .post(
        url,
        {
          headers: { Authorization: token },
          body: {
            oauth_token,
            oauth_verifier,
          },
        },
        {
          headers: { Authorization: token },
        }
      )
      .then((res) => {
        setLoading(false);
        window.location.assign("/profile/linked-accounts");
      })
      .catch((error) => {
        console.log("TwitterCallBackHandler error", error);
      });
    // eslint-disable-next-line
  }, []);
  return <div className="loading-pic">{loading ? <Loader /> : null}</div>;
}
export default TwitterCallBackHandler;
