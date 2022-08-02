import { userConstants } from "./constant";
require("dotenv").config();
var url = process.env.REACT_APP_URL;
const SignUpFunction = (data, id) => (dispatch) => {
  fetch(`${url}/users_mag/signup_magnify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.corporate_email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      userType: "Admin",
      company_id: id,
    }),
  })
    .then((response) => response.json())
    .then((message) => {
      if (message.success) {
        dispatch({ type: userConstants.SIGN_UP_SUCCESS, payload: true });
      } else {
        dispatch({
          type: userConstants.SIGN_UP_ERROR,
          payload: message.message,
        });
      }
    });
};
const ErrorFunction = () => (dispatch) => {
  dispatch({ type: userConstants.SIGN_UP_ERROR_CENCEL, payload: "" });
};
const CencelFunction = () => (dispatch) => {
  dispatch({ type: userConstants.SIGN_UP_RETURN, payload: false });
};
const validateEmail = (data) => (dispatch) => {
  dispatch({
    type: userConstants.SIGN_UP_VALIDATE_EMAIL,
    payload: data,
  });
};
const AddCompany = (data) => (dispatch) => {
  dispatch({ type: userConstants.COMPANY_ADD_REQUEST });
  let formData = new FormData();
  formData.append("company_name", data.company_name);
  formData.append("company_address", data.company_address);
  formData.append("country", data.country);
  formData.append("industry", data.industry);
  formData.append("state", data.province);
  formData.append("postal_code", data.postal_code);
  formData.append("city", data.city);
  formData.append("image", data.company_img);
  fetch(`${url}/company/create-company`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((message) => {
      if (message.success) {
        dispatch({
          type: userConstants.COMPANY_ADD_SUCCESS,
          payload: message.company,
        });
      } else {
        dispatch({
          type: userConstants.COMPANY_ADD_ERROR,
          // payload: true,
          payload: message.message,
        });
      }
    });
};
const backUrl = (data) => (dispatch) => {
  dispatch({ type: userConstants.REMOVE_BACK_SUCCESS, payload: false });
};
export const userActions = {
  SignUpFunction,
  ErrorFunction,
  CencelFunction,
  validateEmail,
  AddCompany,
  backUrl,
};
