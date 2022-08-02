import {
  LOGIN,
  ADD_USER,
  SET_VIDEO_STEP,
  ADD_VIDEO,
  SET_YOUTUBE_DATA,
  SET_TWITTER_DATA,
  SET_COLLABORATOR,
  RESET_VIDEO,
  SET_UPLOAD_PROGRESS,
  SET_VIDEO_COLLABORATORS,
  UPDATE_YOUTUBE,
  TRANSACTION_ID,
  SIA_URL_YT,
  ADD_OTHER_EMAILS_SUCCESS,
  GET_ADDTIONAL_EMAILS_SUCCESS,
  GET_VIDEO_CONTENT_STREAM_SUCCESS,
} from "../constants/action-types";

export function userLogin(payload) {
  return { type: LOGIN, payload };
}

export function addUser(payload) {
  return { type: ADD_USER, payload };
}

export function addVideo(payload) {
  return { type: ADD_VIDEO, payload };
}

export function setYoutubeData(payload) {
  return { type: SET_YOUTUBE_DATA, payload };
}

export function setTwitterData(payload) {
  return { type: SET_TWITTER_DATA, payload };
}

export function setCollaborator(payload) {
  return { type: SET_COLLABORATOR, payload };
}

export function resetVideo() {
  return { type: RESET_VIDEO };
}

export function setVideoStep(payload) {
  return { type: SET_VIDEO_STEP, payload };
}

export function setUplaodProgress(payload) {
  return { type: SET_UPLOAD_PROGRESS, payload };
}

export function setVideoCollabortors(payload) {
  return { type: SET_VIDEO_COLLABORATORS, payload };
}

export function updateYoutube(payload) {
  return { type: UPDATE_YOUTUBE, payload };
}

export function setTransactionId(payload) {
  return { type: TRANSACTION_ID, payload };
}
export function setYTSiaURL(payload) {
  return { type: SIA_URL_YT, payload };
}
export const AddOtherEmails = (payload) => {
  return { type: ADD_OTHER_EMAILS_SUCCESS, payload };
};
export const AdditionalEmails = (payload) => {
  return {
    type: GET_ADDTIONAL_EMAILS_SUCCESS,
    payload,
  };
};
export const setContentStream = (payload) => {
  return {
    type: GET_VIDEO_CONTENT_STREAM_SUCCESS,
    payload,
  };
};
