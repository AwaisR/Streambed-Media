import { forgetConstants } from "./constants";
const initState = {
  ErrorMessg: "",
  Password: "",
  varifiedEmail: false,
  passwordUpdate: false,
};
const forgetPassword = (state = initState, action) => {
  switch (action.type) {
    case forgetConstants.FORGET_PASSWORD_SUCCESS:
      return {
        ...state,
        varifiedEmail: action.payload,
        ErrorMessg: "",
      };
    case forgetConstants.FORGET_PASSWORD_ERROR:
      return {
        ...state,
        varifiedEmail: false,
        ErrorMessg: action.payload,
      };
    case forgetConstants.FORGET_PASSWORD_ERROR_CENCEL:
      return {
        ...state,
        ErrorMessg: "",
        varifiedEmail: false,
        passwordUpdate: false,
      };
    case forgetConstants.PASSWORD_UPDATE_SUCCESSFUL:
      return {
        ...state,
        passwordUpdate: action.payload,
      };
    case forgetConstants.PASSWORD_UPDATE_UNSUCCESSFUL:
      return {
        ...state,
        ErrorMessg: action.payload,
      };
    default:
      return state;
  }
};
export default forgetPassword;
