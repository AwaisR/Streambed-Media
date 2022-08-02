import { SET_FACEBOOK } from "../constants/facebook";

const initialState = {};

function facebook(state = initialState, action) {
  switch (action.type) {
    case SET_FACEBOOK:
      return { ...state, user: action.payload };
      break;
    // case GET_YOUTUBE_VIDEO:
    //   return { ...state, ...user, youtube: action.payload };
    default:
      return state;
      break;
  }
}

export default facebook;
