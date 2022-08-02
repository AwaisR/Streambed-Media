import { wallatsConst } from "./constant";
const initState = {
  AllTransactions: [],
  Balance: [],
};
const Wallet = (state = initState, action) => {
  switch (action.type) {
    case wallatsConst.GET_TRANSACTION_SUCCESS:
      return {
        ...state,
        AllTransactions: action.payload,
      };
    case wallatsConst.GET_TRANSACTION_ONE:
      return {
        ...state,
        Balance: action.payload,
      };
    default:
      return state;
  }
};
export default Wallet;
