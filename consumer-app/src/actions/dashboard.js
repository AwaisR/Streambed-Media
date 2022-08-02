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

export function setVideDataAnalytics(payload) {
  return { type: SET_VIDEO_DATA_ANALYTICS, payload };
}

export function setVideAPIAnalytics(payload) {
  return { type: SET_VIDEO_API_ANALYTICS, payload };
}

export function setVideCollaborators(payload) {
  return { type: SET_POST_COLLABORATORS, payload };
}

export function setVideoCollaboratorsStatistics(payload) {
  return { type: SET_VIDEO_COLLABORATORS_STATISTICS, payload };
}

export function updateVideoCollaboratorsStatistics(payload) {
  return { type: UPDATE_VIDEO_COLLABORATORS_STATISTICS, payload };
}

export function setYoutubeOwnVideo(payload) {
  return { type: SET_YOUTUBE_OWN_VIDEO, payload };
}

export function resetDashboard() {
  return { type: RESET_DASHBOARD };
}

export function setPlateform(payload) {
  return { type: SET_PLATEFORM, payload };
}

export function refreshDashBoard(payload) {
  return { type: REFRESH_DASHBOARD, payload };
}
