import { wallatsConst } from "./constant";
require("dotenv").config();
var url = process.env.REACT_APP_URL;
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
            type: wallatsConst.GET_TRANSACTION_SUCCESS,
            payload: data.data,
          });
        } else {
          console.log("error", data);
        }
      });
  }
};
const addDepositAmount = (data) => (dispatch) => {
  fetch(`${url}/transaction/add-transection`, {
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
      } else {
        console.log("message", message);
      }
    });
};
const getTransactionOne = (token) => (dispatch) => {
  if (token) {
    fetch(`${url}/transaction/getOne-transection`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data.data);
        if (data) {
          dispatch({
            type: wallatsConst.GET_TRANSACTION_ONE,
            payload: data.data,
          });
        } else {
          console.log("error", data);
        }
      });
  }
};
export const walletsAction = {
  getTransaction,
  addDepositAmount,
  getTransactionOne,
};
