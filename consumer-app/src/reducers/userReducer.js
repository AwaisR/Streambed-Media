import {
  ADD_USER,
  ADD_OTHER_EMAILS_SUCCESS,
  GET_ADDTIONAL_EMAILS_SUCCESS,
} from "../constants/action-types";

const initialState = {
  AddEmails: false,
  AddtionalEmails: [],
};

function user(state = initialState, action) {
  switch (action.type) {
    case ADD_USER:
      return { ...state, user: action.payload };
      break;
    case ADD_OTHER_EMAILS_SUCCESS:
      return { ...state, AddEmails: !state.AddEmails };
      break;
    case GET_ADDTIONAL_EMAILS_SUCCESS:
      return { ...state, AddtionalEmails: action.payload };
    // case GET_YOUTUBE_VIDEO:
    //   return { ...state, ...user, youtube: action.payload };
    default:
      return state;
      break;
  }
}

export default user;
