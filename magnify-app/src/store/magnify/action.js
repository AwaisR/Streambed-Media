import { MagnifyConst } from "./constant";
require("dotenv").config();
var url = process.env.REACT_APP_URL;
const getCurentUser = (token) => (dispatch) => {
  if (token) {
    fetch(`${url}/users_mag/user_data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          dispatch({
            type: MagnifyConst.CURRENT_USER_GET_DATA_SUCCESS,
            payload: data.data,
          });
        } else {
          console.log("error", data);
        }
      });
  }
};
const getCompaniesPosts = (token) => (dispatch) => {
  if (token) {
    fetch(`${url}/companyPosts/getCompanyPosts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          dispatch({
            type: MagnifyConst.USER_POSTS_SUCCESS,
            payload: data.data.posts,
          });
        } else {
          console.log("error", data.message);
        }
      });
  }
};
const getYouTubeVidoes = (token) => (dispatch) => {
  if (token) {
    fetch(`${url}/api/youtube-videos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          dispatch({
            type: MagnifyConst.GET_YOUTUBE_VIDEOS,
            payload: data.videos,
          });
        } else {
          console.log("error", data.message);
        }
      });
  }
};
const removeCompanyVideo = (videoId, token) => (dispatch) => {
  dispatch({ type: MagnifyConst.FAVORITE_VIDEO_REQUEST, payload: true });
  fetch(`${url}/companyPosts/delete_video`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      VideoId: videoId,
      deleted: true,
    }),
  })
    .then((response) => response.json())
    .then((message) => {
      if (message.success) {
        dispatch(getCompaniesPosts(token));
      } else {
        console.log("message", message);
      }
    });

  // dispatch({ type: MagnifyConst.VIDEO_REMOVE_SUCCESS, payload: data });
};
const showDeletedItems = (data) => (dispatch) => {
  dispatch({ type: MagnifyConst.SHOW_DELETED_POST, payload: data });
};
const getTransaction = (token) => (dispatch) => {
  if (token) {
    fetch(`${url}/transaction/get-transection`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          dispatch({
            type: MagnifyConst.GET_WALLETS_BALANCE,
            payload: data.data,
          });
        } else {
          console.log("error", data);
        }
      });
  }
};

const PaidVideoPrice = (data) => (dispatch) => {
  fetch(`${url}/transaction/add-magnifyPrice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${data.token}`,
    },
    body: JSON.stringify({
      type: data.type,
      amount: data.amount,
      remaining: data.remaining,
    }),
  })
    .then((response) => response.json())
    .then((message) => {
      if (message) {
        dispatch(getTransaction(data.token));
        console.log("message", message);
      } else {
        console.log("message", message);
      }
    });
};
const addPaidVideo = (data) => (dispatch) => {
  dispatch({ type: MagnifyConst.SH0W_PAID_VIDEOS, payload: data });
};

const addYouTubeFavouriteVideo = (data) => (dispatch) => {
  dispatch({ type: MagnifyConst.FAVORITE_VIDEO_REQUEST, payload: true });
  fetch(`${url}/api/youtube-paidVideo`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${data.token}`,
    },
    body: JSON.stringify({
      videoId: data.videoId,
      fevorite: data.favourite,
    }),
  })
    .then((response) => response.json())
    .then((message) => {
      if (message.data) {
        dispatch(getYouTubeVidoes(data.token));
        dispatch(getCompaniesPosts(data.token));
        console.log("message", message);
      } else {
        console.log("message", message);
      }
    });
};
const addCompanyFavouriteVideo = (data) => (dispatch) => {
  dispatch({ type: MagnifyConst.FAVORITE_VIDEO_REQUEST, payload: true });
  fetch(`${url}/companyPosts/video_paid`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${data.token}`,
    },
    body: JSON.stringify({
      VideoId: data.videoId,
      fevorite: data.favourite,
    }),
  })
    .then((response) => response.json())
    .then((message) => {
      if (message.success) {
        console.log("message", message);
        dispatch(getCompaniesPosts(data.token));
        dispatch(getYouTubeVidoes(data.token));
      } else {
        console.log("message", message);
      }
    });
};
const paidYoutubeVideo = (data, token) => (dispatch) => {
  fetch(`${url}/api/youtube-paidVideo`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      videoId: data,
      price: "505",
    }),
  })
    .then((response) => response.json())
    .then((message) => {
      if (message.success) {
        dispatch(getYouTubeVidoes(token));
        console.log("message", message);
      } else {
        console.log("message", message);
      }
    });
};
const paidCompanyVideo = (data, token) => (dispatch) => {
  fetch(`${url}/companyPosts/video_paid`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      VideoId: data,
      videoprice: "505",
    }),
  })
    .then((response) => response.json())
    .then((message) => {
      if (message.success) {
        console.log("message", message);
        dispatch(getCompaniesPosts(token));
      } else {
        console.log("message", message);
      }
    });
};
const EmptyUserPosts = () => (dispatch) => {
  dispatch({ type: MagnifyConst.EMPTY_SATATE_USERPOSTS, payload: true });
};
const removeYouTubeVideo = (videoId, token) => (dispatch) => {
  dispatch({ type: MagnifyConst.FAVORITE_VIDEO_REQUEST, payload: true });
  fetch(`${url}/api/delete_video`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      videoId: videoId,
      deleted: true,
    }),
  })
    .then((response) => response.json())
    .then((message) => {
      if (message.success) {
        console.log("message", message);
        dispatch(getYouTubeVidoes(token));
      } else {
        console.log("message", message);
      }
    });
};
export const magnifyActions = {
  getCurentUser,
  getCompaniesPosts,
  removeCompanyVideo,
  showDeletedItems,
  getYouTubeVidoes,
  PaidVideoPrice,
  getTransaction,
  addYouTubeFavouriteVideo,
  addCompanyFavouriteVideo,
  paidYoutubeVideo,
  paidCompanyVideo,
  EmptyUserPosts,
  removeYouTubeVideo,
};
