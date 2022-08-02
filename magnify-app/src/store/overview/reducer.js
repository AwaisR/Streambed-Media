import { overviewConsts } from "./constant";
const initSate = {
  CurentUserData: {},
};
const OverView = (state = initSate, action) => {
  switch (action.type) {
    case overviewConsts.GET_CURENT_USER:
      return {
        ...state,
        CurentUserData: action.payload,
      };
    default:
      return state;
  }
};
export default OverView;
