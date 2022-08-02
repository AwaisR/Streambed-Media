import React, { useEffect, useState } from "react";
import qs from "query-string";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import Loader from "../shared/Loader";
function LinkedInRedirectHandler() {
  let location = useLocation();
  let history = useHistory();
  const [loading, setLoading] = useState(true);
  const { code } = qs.parse(location.search);
  const token = window.localStorage.getItem("token");
  const url = "/api/linkedin/auth/linkedin/callback";
  useEffect(() => {
    if (code === undefined) {
      setLoading(false);
      history.push("/settings/link");
    }
    axios
      .post(
        url,
        {
          headers: { Authorization: token },
          ContentType: "application/json",
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
        setLoading(false);
        // history.push("/profile/linked-accounts");
        console.log("Linkedin auth error", error);
      });
    // eslint-disable-next-line
  }, []);
  return <div className="loading-pic">{loading ? <Loader /> : null}</div>;
}

export default LinkedInRedirectHandler;
