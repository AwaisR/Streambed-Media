import { LOGIN } from "../constants/action-types";

const initialState = {
  login: false,
};

function auth(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, login: action.payload };
    // break;
    default:
      return state;
    // break;
  }
}

export default auth;
