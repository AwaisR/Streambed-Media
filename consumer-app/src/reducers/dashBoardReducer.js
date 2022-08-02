import {
  SET_VIDEO_DATA_ANALYTICS,
  SET_VIDEO_API_ANALYTICS,
  SET_POST_COLLABORATORS,
  SET_VIDEO_COLLABORATORS_STATISTICS,
  UPDATE_VIDEO_COLLABORATORS_STATISTICS,
  SET_YOUTUBE_OWN_VIDEO,
  RESET_DASHBOARD,
  SET_PLATEFORM,
  REFRESH_DASHBOARD,
} from "../constants/action-types";
const initialState = {
  videoCollaboratorsStatistics: [],
  videoAnalytics: [],
  videoAPIAnalytics: [],
  videoCollaborator: [],
  youtubeVideo: [],
  plateForm: "",
  refresh: false,
};
function dashboard(state = initialState, action) {
  switch (action.type) {
    case SET_VIDEO_DATA_ANALYTICS:
      return { ...state, videoAnalytics: action.payload };
      break;
    case SET_VIDEO_API_ANALYTICS:
      return { ...state, videoAPIAnalytics: action.payload };

      break;
    case SET_POST_COLLABORATORS:
      return { ...state, videoCollaborator: action.payload };

      break;
    case SET_VIDEO_COLLABORATORS_STATISTICS:
      return {
        ...state,
        videoCollaboratorsStatistics: [...action.payload],
      };
      break;
    case UPDATE_VIDEO_COLLABORATORS_STATISTICS:
      return {
        ...state,
        videoCollaboratorsStatistics: action.payload,
      };
      break;

    case SET_YOUTUBE_OWN_VIDEO:
      return {
        ...state,
        youtubeVideo: action.payload,
      };
      break;
    case SET_PLATEFORM: {
      return { ...state, plateForm: action.payload };
      break;
    }
    case REFRESH_DASHBOARD: {
      return { ...state, refresh: action.payload };
      break;
    }

    case RESET_DASHBOARD:
      return {
        ...state,
        videoCollaboratorsStatistics: [],
        videoAnalytics: [],
        videoAPIAnalytics: [],
        videoCollaborator: [],
        youtubeVideo: [],
      };
      break;
    default:
      return state;
  }
}

export default dashboard;
