import { SettingsConst } from "./constant";
const initSate = {
  user: {},
  showMessage: "",
  userAdded: false,
  userDeleted: false,
  Curentuser: {},
  ///for other button delete user account ///
  userDeletedSecond: false,
  showMessageSecond: "",
  toggle: false,
};
const Settings = (state = initSate, action) => {
  switch (action.type) {
    case SettingsConst.USER_GET_DATA_SUCCESS:
      return {
        ...state,
        user: action.payload,
      };
    case SettingsConst.OTHER_USER_ADDED_SUCCESS:
      return {
        ...state,
        showMessage: action.payload,
        userAdded: true,
      };
    case SettingsConst.OTHER_USER_ADDED_ERROR:
      return {
        ...state,
        showMessage: action.payload,
        userAdded: false,
      };
    case SettingsConst.HIDE_ERROR_POPUP:
      return {
        ...state,
        showMessage: "",
        userAdded: false,
        userDeleted: false,
        userDeletedSecond: false,
        showMessageSecond: "",
      };
    case SettingsConst.DELETE_USER_SUCCESS:
      return {
        ...state,
        showMessage: action.payload,
        userDeleted: true,
      };
    case SettingsConst.DELETE_USER_ERROR:
      return {
        ...state,
        showMessage: action.payload,
        userDeleted: false,
      };
    case SettingsConst.UPDATE_COMPANY_SUCCESS:
      return {
        ...state,
        showMessage: action.payload,
        // userAdded: true,
      };
    case SettingsConst.UPDATE_COMPANY_ERROR:
      return {
        ...state,
        showMessage: action.payload,
        userAdded: false,
      };
    case SettingsConst.UPDATE_USER_SUCCESS:
      return {
        ...state,
        showMessage: action.payload,
        // userAdded: true,
      };
    case SettingsConst.UPDATE_USER_ERROR:
      return {
        ...state,
        showMessage: action.payload,
        userAdded: false,
      };
    case SettingsConst.GET_CURENT_USER_SUCCESS:
      return {
        ...state,
        Curentuser: action.payload,
        // user: action.payload,
      };
    case SettingsConst.DELETE_USER_SUCCESS_SECOND:
      return {
        ...state,
        showMessageSecond: action.payload,
        userDeletedSecond: true,
      };
    case SettingsConst.SIDE_BAR_POP_UP:
      return {
        ...state,
        toggle: !state.toggle,
      };
    default:
      return state;
  }
};
export default Settings;
