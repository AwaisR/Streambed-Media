import { userConstants } from "./constant";
const initSate = {
  users: [],
  Signup: false,
  Error: "",
  companyExist: "",
  company: {},
  AddCompany: false,
  companyAdd: false,
  // company: false,
  companyFalse: false,
};
const Users = (state = initSate, action) => {
  switch (action.type) {
    case userConstants.SIGN_UP_SUCCESS:
      return {
        ...state,
        Signup: action.payload,
        AddCompany: false,
        companyAdd: false,
      };
    case userConstants.SIGN_UP_ERROR:
      return {
        ...state,
        Error: action.payload,
        AddCompany: false,
        companyAdd: false,
      };
    case userConstants.SIGN_UP_ERROR_CENCEL:
      return {
        ...state,
        Error: "",
        Signup: false,
        companyAdd: false,
        // company: false,
        companyFalse: false,
        companyExist: "",
      };
    case userConstants.SIGN_UP_RETURN:
      return {
        ...state,
        Error: "",
        Signup: action.payload,
      };
    case userConstants.SIGN_UP_VALIDATE_EMAIL:
      return {
        ...state,
        Error: action.payload,
      };
    case userConstants.SIGN_UP_VALIDATE_COMPANY:
      return {
        ...state,
        companyExist: action.payload,
        company: true,
      };
    case userConstants.SIGN_UP_VALIDATE_COMPANY_FALSE:
      return {
        ...state,
        companyFalse: action.payload,
        companyExist: "",
      };
    case userConstants.COMPANY_ADD_SUCCESS:
      return {
        ...state,
        company: action.payload,
        AddCompany: true,
        // companyAdd: true,
      };
    case userConstants.COMPANY_ADD_ERROR:
      return {
        ...state,
        companyExist: action.payload,
        companyAdd: true,
        companyFalse: true,
      };
    case userConstants.REMOVE_BACK_SUCCESS:
      return {
        ...state,
        companyExist: "",
        AddCompany: false,
      };
    default:
      return state;
  }
};
export default Users;
