import { overviewConsts } from "./constant";
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
            type: overviewConsts.GET_CURENT_USER,
            payload: data.data,
          });
        } else {
          dispatch({
            type: overviewConsts.GET_CURENT_USER_ERROR,
            payload: data.message,
          });
        }
      });
  }
};
export const overviewAction = {
  getCurentUser,
};
