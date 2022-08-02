import { SettingsConst } from "./constant";
require("dotenv").config();
var url = process.env.REACT_APP_URL;
const getUser = (token) => (dispatch) => {
  if (token) {
    fetch(`${url}/company/get-company`, {
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
            type: SettingsConst.USER_GET_DATA_SUCCESS,
            payload: data.data,
          });
        } else {
          console.log("error", data);
        }
      });
  }
};
const addNewUser = (data, token) => (dispatch) => {
  fetch(`${url}/users_mag/add-otherUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      userType: data.userType,
    }),
  })
    .then((response) => response.json())
    .then((message) => {
      if (message.success) {
        dispatch(getUser(token));
        dispatch({
          type: SettingsConst.OTHER_USER_ADDED_SUCCESS,
          payload: message.message,
        });
      } else {
        dispatch({
          type: SettingsConst.OTHER_USER_ADDED_ERROR,
          payload: message.message,
        });
      }
    });
};
const updateCompany = (data, token) => (dispatch) => {
  let formData = new FormData();
  formData.append("company_name", data.company_name && data.company_name);
  formData.append("description", data.description && data.description);
  formData.append("image", data.image && data.image);
  fetch(`${url}/company/update-company`, {
    method: "PUT",
    headers: {
      Authorization: `${token}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((message) => {
      if (message.success) {
        dispatch(getUser(token));
        dispatch({
          type: SettingsConst.UPDATE_COMPANY_SUCCESS,
          payload: message.msg,
        });
      } else {
        dispatch({
          type: SettingsConst.UPDATE_COMPANY_ERROR,
          payload: message.message,
        });
      }
    });
};
const EditNewUser = (data, token) => (dispatch) => {
  fetch(`${url}/users_mag/update-users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      userType: data.userType,
    }),
  })
    .then((response) => response.json())
    .then((message) => {
      if (message.success) {
        dispatch(getUser(token));
        dispatch({
          type: SettingsConst.UPDATE_USER_SUCCESS,
          payload: message.message,
        });
      } else {
        dispatch({
          type: SettingsConst.UPDATE_USER_ERROR,
          payload: message.message,
        });
      }
    });
};
const removeErrorPopUp = () => (dispatch) => {
  dispatch({
    type: SettingsConst.HIDE_ERROR_POPUP,
    payload: true,
  });
};
const deleteUser = (data, token) => (dispatch) => {
  fetch(`${url}/users_mag/delete_user`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      id: data.id,
    }),
  })
    .then((response) => response.json())
    .then((message) => {
      if (message.success) {
        dispatch(getUser(token));
        dispatch({
          type: SettingsConst.DELETE_USER_SUCCESS,
          payload: message.message,
        });
      } else {
        dispatch({
          type: SettingsConst.DELETE_USER_ERROR,
          payload: message.message,
        });
      }
    });
};
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
            type: SettingsConst.GET_CURENT_USER_SUCCESS,
            payload: data.data,
          });
        } else {
          dispatch({
            type: SettingsConst.GET_CURENT_USER_ERROR,
            payload: data.message,
          });
        }
      });
  }
};
const deleteUserSecond = (data, token) => (dispatch) => {
  fetch(`${url}/users_mag/delete_user`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      id: data.id,
    }),
  })
    .then((response) => response.json())
    .then((message) => {
      if (message.success) {
        dispatch(getUser(token));
        dispatch({
          type: SettingsConst.DELETE_USER_SUCCESS_SECOND,
          payload: message.message,
        });
      } else {
        dispatch({
          type: SettingsConst.DELETE_USER_ERROR_SECOND,
          payload: message.message,
        });
      }
    });
};
const sideBarPopUp = () => (dispatch) => {
  dispatch({ type: SettingsConst.SIDE_BAR_POP_UP, payload: true });
};
export const SettingsAction = {
  getUser,
  addNewUser,
  EditNewUser,
  updateCompany,
  removeErrorPopUp,
  deleteUser,
  getCurentUser,
  deleteUserSecond,
  sideBarPopUp,
};
