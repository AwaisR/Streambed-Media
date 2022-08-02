import { AnylaticConstant } from "./constant";

const initSate = {
  CompanyAnylatics: [],
};
const Analytics = (state = initSate, action) => {
  switch (action.type) {
    case AnylaticConstant.FETCH_COMPANY_ANYLATICS_SUCCESS:
      return {
        ...state,
        CompanyAnylatics: action.payload,
      };
    default:
      return state;
  }
};
export default Analytics;
