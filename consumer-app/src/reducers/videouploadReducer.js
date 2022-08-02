import {
  ADD_VIDEO,
  SET_PLATEFORM,
  SET_TWITTER_DATA,
  SET_COLLABORATOR,
  RESET_VIDEO,
  SET_VIDEO_STEP,
  SET_UPLOAD_PROGRESS,
  TRANSACTION_ID,
  SIA_URL_YT,
} from "../constants/action-types";

const initialState = {
  step: 1,
  progress: 20,
  video: {},
  plateform: "youtube",
  youtube: {},
  collaborator: [],
  twitter: {},
  txid: "",
  sia_url: "",
};

function video(state = initialState, action) {
  switch (action.type) {
    case ADD_VIDEO: {
      return { ...state, video: action.payload };
      break;
    }
    case SET_PLATEFORM: {
      return { ...state, plateform: action.payload };
      break;
    }

    case SET_TWITTER_DATA: {
      return { ...state, twitter: action.payload };
      break;
    }
    case SET_COLLABORATOR: {
      return { ...state, collaborator: action.payload };
      break;
    }
    case SET_VIDEO_STEP: {
      return { ...state, step: action.payload };
      break;
    }
    case SET_UPLOAD_PROGRESS: {
      return { ...state, progress: action.payload };
      break;
    }
    case TRANSACTION_ID: {
      return { ...state, txid: action.payload };
      break;
    }
    case SIA_URL_YT: {
      return { ...state, sia_url: action.payload };
      break;
    }
    case RESET_VIDEO: {
      return initialState;
      break;
    }

    default:
      return state;
      break;
  }
}

export default video;
