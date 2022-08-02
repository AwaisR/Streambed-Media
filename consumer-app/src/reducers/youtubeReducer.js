import {
  SET_YOUTUBE_DATA,
  UPDATE_YOUTUBE,
  RESET_DASHBOARD,
  GET_VIDEO_CONTENT_STREAM_SUCCESS,
} from "../constants/action-types";

const initialState = { refresh: false, video: [], contentVideos: [] };

function youtube_video(state = initialState, action) {
  switch (action.type) {
    case SET_YOUTUBE_DATA: {
      return { ...state, video: action.payload };
      // break;
    }
    case UPDATE_YOUTUBE: {
      return { ...state, refresh: action.payload };
      // break;
    }
    case RESET_DASHBOARD:
      return {
        ...state,
        video: [],
      };
    case GET_VIDEO_CONTENT_STREAM_SUCCESS: {
      return {
        ...state,
        contentVideos: action.payload,
      };
    }
    // break;
    default:
      return state;
    // break;
  }
}

export default youtube_video;
