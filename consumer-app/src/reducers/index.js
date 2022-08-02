import { combineReducers } from "redux";

import authReducer from "./authReducer";
import userReducer from "./userReducer";
import videouploadReducer from "./videouploadReducer";
import youtubeReducer from "./youtubeReducer";
import dashboardReducer from "./dashBoardReducer";
import facebookReducer from "./facebook";
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  videoupload: videouploadReducer,
  youtube: youtubeReducer,
  dashboard: dashboardReducer,
  facebook: facebookReducer,
});

export default rootReducer;
