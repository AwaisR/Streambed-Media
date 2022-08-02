import React from "react";
import qs from "query-string";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
function ZoomOauth2callback(props) {
  let location = useLocation();
  const history = useHistory();
  const parsed = qs.parse(location.search);
  const token = window.localStorage.getItem("token");
  const url = `/api/zoom/oauthcallback?code=${parsed.code}`;

  axios
    .get(url, {
      headers: { authorization: token },
    })
    .then((res) => {
      history.push("/profile/linked-accounts");
    })
    .catch((error) => {
      console.log("Oauth2callback error", error);
    });

  return <div></div>;
}

export default ZoomOauth2callback;
