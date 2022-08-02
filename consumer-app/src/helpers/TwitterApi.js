const GET_TWITTER_TOKEN = "/users/getTwitterToken";
const DELETE_TWITTER_TOKEN = "/users/deleteTwitterToken";
const TWITTER_AUTH = "/api/twitter_auth";

const token = localStorage.getItem("token");

if (token === "null") {
  window.location.assign("/");
}
const HEADERS = (methodName) => ({
  method: methodName,
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});

const getTokens = () => {
  return fetch(GET_TWITTER_TOKEN, HEADERS("GET"))
    .then((response) => response.json())
    .catch((err) => {
      console.log("something went wrong", err);
    });
};

const autheticate = async () => {
  return fetch(TWITTER_AUTH, HEADERS("POST")).then((response) =>
    response.json()
  );
};

const unauthenticate = async () => {
  return fetch(DELETE_TWITTER_TOKEN, HEADERS("POST"));
};

const getTweet = async () => {
  return fetch("/posts/get-video", HEADERS("GET"))
    .then((response) => response.json())
    .catch((err) => console.log("something went wrong", err));
};

const getVideoList = async () => {
  return fetch("/posts/videos", HEADERS("GET")).then((response) =>
    response.json()
  );
};
export default {
  getTokens,
  autheticate,
  unauthenticate,
  getTweet,
  getVideoList,
};
