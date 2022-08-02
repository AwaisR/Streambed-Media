import { AnylaticConstant } from "./constant";
require("dotenv").config();
var url = process.env.REACT_APP_URL;
const CompanyVideosAnylatics = (token) => (dispatch) => {
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
            type: AnylaticConstant.FETCH_COMPANY_ANYLATICS_SUCCESS,
            payload: data,
          });
        } else {
          console.log("error", data.message);
        }
      });
  }
};
export const anylaticActions = {
  CompanyVideosAnylatics,
};
