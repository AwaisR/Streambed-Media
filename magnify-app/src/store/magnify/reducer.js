import { MagnifyConst } from "./constant";
const initSate = {
  CurentUserData: {},
  UserPosts: [],
  AllTransactions: [],
  YouTubePosts: [],
  Load: "",
};
const Magnify = (state = initSate, action) => {
  switch (action.type) {
    case MagnifyConst.CURRENT_USER_GET_DATA_SUCCESS:
      return {
        ...state,
        CurentUserData: action.payload,
      };
    case MagnifyConst.USER_POSTS_SUCCESS:
      return {
        ...state,
        UserPosts: action.payload,
        YouTubePosts: [],
        Load: false,
      };
    case MagnifyConst.GET_YOUTUBE_VIDEOS:
      return {
        ...state,
        // UserPosts: action.payload,
        YouTubePosts: action.payload,
        Load: false,
      };
    case MagnifyConst.VIDEO_REMOVE_SUCCESS:
      return {
        ...state,
        UserPosts: [...action.payload],
      };
    case MagnifyConst.SHOW_DELETED_POST:
      return {
        ...state,
        UserPosts: action.payload,
      };
    case MagnifyConst.GET_WALLETS_BALANCE:
      return {
        ...state,
        AllTransactions: action.payload,
      };
    case MagnifyConst.EMPTY_SATATE_USERPOSTS:
      return {
        ...state,
        UserPosts: [],
      };
    case MagnifyConst.FAVORITE_VIDEO_REQUEST:
      return {
        ...state,
        Load: true,
      };
    case MagnifyConst.PAID_VIDEO_SUCCESS:
      return {
        ...state,
        PaidAndFevVideo: !state.PaidAndFevVideo,
      };
    case MagnifyConst.SH0W_PAID_VIDEOS:
      return {
        ...state,
        UserPosts: action.payload,
        PaidAndFevVideo: !state.PaidAndFevVideo,
      };
    default:
      return state;
  }
};
export default Magnify;
