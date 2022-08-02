import { forgetConstants } from "./constants";
var url = process.env.REACT_APP_URL;
require("dotenv").config();
const varifyEmail = (data) => (dispatch) => {
  fetch(`${url}/users_mag/forgot-password_magnify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data,
      userType: "streambed-magnify",
    }),
  })
    .then((response) => response.json())
    .then((message) => {
      if (message.success) {
        dispatch({
          type: forgetConstants.FORGET_PASSWORD_SUCCESS,
          payload: true,
        });
      } else {
        dispatch({
          type: forgetConstants.FORGET_PASSWORD_ERROR,
          payload: message.msg,
        });
      }
    });
};
const CencelErrors = () => (dispatch) => {
  dispatch({
    type: forgetConstants.FORGET_PASSWORD_ERROR_CENCEL,
    payload: true,
  });
};
const resetPassword = (dataa, user, token, valid) => (dispatch) => {
  const link = `${url}/users_mag/accounts/reset-password`;
  const data = {
    email: user,
    token: token,
    password: dataa.password,
    valid: valid,
    userType: "streambed-magnify",
  };
  fetch(link, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      // if success show confirm msg to user
      if (data.success) {
        dispatch({
          type: forgetConstants.PASSWORD_UPDATE_SUCCESSFUL,
          payload: true,
        });
      } else {
        dispatch({
          type: forgetConstants.PASSWORD_UPDATE_UNSUCCESSFUL,
          payload: data.msg,
        });
      }
    });
};

export const forgetActions = { varifyEmail, CencelErrors, resetPassword };
