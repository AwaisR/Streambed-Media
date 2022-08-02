import { userLoginConstant } from "./constant";
const initState = {
  loginError: "",
  userData: {},
  isLogin: false,
  logout: false,
};
const loginUser = (state = initState, action) => {
  switch (action.type) {
    case userLoginConstant.USER_LOGIN_SUCCESS:
      return {
        ...state,
        userData: action.payload,
        isLogin: true,
        loginError: "",
        logout: false,
      };
    case userLoginConstant.USER_LOGIN_ERROR:
      return {
        ...state,
        loginError: action.payload,
        logout: false,
      };
    case userLoginConstant.USER_LOGIN_POP_UP_CENECL:
      return {
        ...state,
        loginError: "",
      };
    case userLoginConstant.USER_LOGOUT_SUCCESS:
      return {
        ...state,
        userData: "",
        isLogin: action.payload,
        loginError: "",
        logout: true,
      };
    default:
      return state;
  }
};
export default loginUser;
