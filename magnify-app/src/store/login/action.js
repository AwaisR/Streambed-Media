import { userLoginConstant } from "./constant";
require("dotenv").config();
var url = process.env.REACT_APP_URL;
const loginFuntion = (data) => (dispatch) => {
  fetch(`${url}/users_mag/login_magnify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  })
    .then((response) => response.json())
    .then((message) => {
      if (message.success) {
        localStorage.setItem("token", message.token);
        localStorage.setItem(
          "Curentuser",
          message.user.first_name + " " + message.user.last_name
        );
        localStorage.setItem(
          "userType",
          message.user.userType ? message.user.userType : "Admin"
        );
        dispatch({
          type: userLoginConstant.USER_LOGIN_SUCCESS,
          payload: message.user,
        });
      } else {
        dispatch({
          type: userLoginConstant.USER_LOGIN_ERROR,
          payload: message.msg,
        });
      }
    });
};
const cencelPopUp = () => (dispatch) => {
  dispatch({
    type: userLoginConstant.USER_LOGIN_POP_UP_CENECL,
    payload: "",
  });
};
const logoutUser = () => (dispatch) => {
  dispatch({ type: userLoginConstant.USER_LOGOUT_SUCCESS, payload: false });
};
export const userLogin = {
  loginFuntion,
  cencelPopUp,
  logoutUser,
};
