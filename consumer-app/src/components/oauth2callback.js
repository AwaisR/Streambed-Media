import React, { useState } from "react";
import qs from "query-string";
import axios from "axios";
import Loader from "./shared/Loader";
import { useLocation, useHistory } from "react-router-dom";
function Oauth2callback(props) {
  let location = useLocation();
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const parsed = qs.parse(location.search);
  const token = window.localStorage.getItem("token");
  const url = `/api/oauth2callback?code=${parsed.code}&scope=${parsed.scope}`;
  axios
    .get(url, {
      headers: { authorization: token },
    })
    .then((res) => {
      setLoading(false);
      history.push("/profile/linked-accounts");
    })
    .catch((error) => {
      console.log("Oauth2callback error", error);
    });

  return <div className="loading-pic">{loading ? <Loader /> : null}</div>;
}

export default Oauth2callback;
