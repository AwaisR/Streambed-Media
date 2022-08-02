import React, { useEffect, useState } from "react";
import qs from "query-string";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import Loader from "../shared/Loader";
function InstagramRedirectHandler() {
  let location = useLocation();
  let history = useHistory();
  const [loading, setLoading] = useState(true);
  const { code } = qs.parse(location.search);
  const token = window.localStorage.getItem("token");
  const url = "/api/instagram/instagram-access-token";

  useEffect(() => {
    axios
      .post(
        url,
        {
          headers: { Authorization: token },
          body: {
            code,
          },
        },
        {
          headers: { Authorization: token },
        }
      )
      .then((res) => {
        setLoading(false);
        history.push("/profile/linked-accounts");
      })
      .catch((error) => {
        console.log("instagram auth error", error);
      });
    // eslint-disable-next-line
  }, []);
  return <div className="loading-pic">{loading ? <Loader /> : null}</div>;
}

export default InstagramRedirectHandler;
