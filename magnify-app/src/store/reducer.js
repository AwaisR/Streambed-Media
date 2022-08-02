import { combineReducers } from "redux";
import Users from "./signup/reducer";
import forgetPassword from "./forgetPassword/reducer";
import loginUser from "./login/reducer";
import Settings from "./settings/reducer";
import OverView from "./overview/reducer";
import Magnify from "./magnify/reducer";
import Analytics from "./anylatics/reducer";
import Wallet from "./wallet/reducer";
const rootReducer = combineReducers({
  Users,
  forgetPassword,
  loginUser,
  Settings,
  OverView,
  Magnify,
  Analytics,
  Wallet,
});

export default rootReducer;
