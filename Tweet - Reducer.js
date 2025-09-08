// reducer.js
import {
  TWEET_CREATE_REQUEST,
  TWEET_CREATE_SUCCESS,
  TWEET_CREATE_FAILURE,
  TWEET_DELETE_REQUEST,
  TWEET_DELETE_SUCCESS,
  TWEET_DELETE_FAILURE,
  TWEET_RESTORE_REQUEST,
  TWEET_RESTORE_SUCCESS,
  TWEET_RESTORE_FAILURE,
  GET_ALL_TWEETS_REQUEST,
  GET_ALL_TWEETS_SUCCESS,
  GET_ALL_TWEETS_FAILURE,
  GET_USERS_TWEET_REQUEST,
  GET_USERS_TWEET_SUCCESS,
  GET_USERS_TWEET_FAILURE,
  LIKE_TWEET_REQUEST,
  LIKE_TWEET_SUCCESS,
  LIKE_TWEET_FAILURE,
  USER_LIKE_TWEET_REQUEST,
  USER_LIKE_TWEET_SUCCESS,
  USER_LIKE_TWEET_FAILURE,
  RETWEET_CREATE_REQUEST,
  RETWEET_CREATE_SUCCESS,
  RETWEET_CREATE_FAILURE,
  FIND_TWEET_BY_ID_REQUEST,
  FIND_TWEET_BY_ID_SUCCESS,
  FIND_TWEET_BY_ID_FAILURE,
  REPLY_TWEET_REQUEST,
  REPLY_TWEET_SUCCESS,
  REPLY_TWEET_FAILURE,
  FETCH_MOST_LIKED_TWEETS_REQUEST,
  FETCH_MOST_LIKED_TWEETS_SUCCESS,
  FETCH_MOST_LIKED_TWEETS_FAILURE,
  TWEET_EDIT_REQUEST,
  TWEET_EDIT_SUCCESS,
  TWEET_EDIT_FAILURE,
  SEARCH_TWEETS_REQUEST,
  SEARCH_TWEETS_SUCCESS,
  SEARCH_TWEETS_FAILURE,
} from "./ActionType";

const initialState = {
  loading: false,
  error: null,
  twits: [],
  twit: null,
  likedTwits: [],
  like: null,
  retwit: null,
  mostLiked: [],
  searchTwits: [],
};

const tweetReducer = (state = initialState, action) => {
  switch (action.type) {
    case TWEET_CREATE_REQUEST:
    case TWEET_DELETE_REQUEST:
    case TWEET_RESTORE_REQUEST:
    case USER_LIKE_TWEET_REQUEST:
    case LIKE_TWEET_REQUEST:
    case RETWEET_CREATE_REQUEST:
    case FIND_TWEET_BY_ID_REQUEST:
    case REPLY_TWEET_REQUEST:
    case FETCH_MOST_LIKED_TWEETS_REQUEST:
    case GET_ALL_TWEETS_REQUEST:
    case GET_USERS_TWEET_REQUEST:
      return { ...state, loading: true, error: null };

    case TWEET_CREATE_FAILURE:
    case TWEET_DELETE_FAILURE:
    case TWEET_RESTORE_FAILURE:
    case TWEET_EDIT_FAILURE:
    case GET_ALL_TWEETS_FAILURE:
    case GET_USERS_TWEET_FAILURE:
    case USER_LIKE_TWEET_FAILURE:
    case LIKE_TWEET_FAILURE:
    case RETWEET_CREATE_FAILURE:
    case FIND_TWEET_BY_ID_FAILURE:
    case REPLY_TWEET_FAILURE:
    case FETCH_MOST_LIKED_TWEETS_FAILURE:
    case SEARCH_TWEETS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case TWEET_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        twits: [action.payload, ...state.twits],
      };

    case GET_ALL_TWEETS_SUCCESS:
    case GET_USERS_TWEET_SUCCESS:
      return { ...state, loading: false, twits: action.payload };

    case USER_LIKE_TWEET_SUCCESS:
      return { ...state, loading: false, likedTwits: action.payload };

    case LIKE_TWEET_SUCCESS:
      return {
        ...state,
        loading: false,
        twits: state.twits.map((twit) =>
          twit.id === action.payload.id ? action.payload : twit
        ),
        like: action.payload,
      };

    case TWEET_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        twits: state.twits.map((twit) =>
          twit.id === action.payload ? { ...twit, deleted: true } : twit
        ),
      };

    case TWEET_RESTORE_SUCCESS:
      return {
        ...state,
        loading: false,
        twits: state.twits.map((twit) =>
          twit.id === action.payload.id ? action.payload : twit
        ),
      };

    case RETWEET_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        twits: state.twits.map((twit) =>
          twit.id === action.payload.id ? action.payload : twit
        ),
        retwit: action.payload,
      };

    case FIND_TWEET_BY_ID_SUCCESS:
    case REPLY_TWEET_SUCCESS:
      return { ...state, loading: false, twit: action.payload };

    case FETCH_MOST_LIKED_TWEETS_SUCCESS:
      return { ...state, loading: false, mostLiked: action.payload };

    case TWEET_EDIT_SUCCESS:
      return {
        ...state,
        loading: false,
        twits: state.twits.map((twit) =>
          twit.id === action.payload.id ? action.payload : twit
        ),
        twit:
          state.twit && state.twit.id === action.payload.id
            ? action.payload
            : state.twit,
      };

    case SEARCH_TWEETS_SUCCESS:
      return { ...state, loading: false, searchTwits: action.payload };

    default:
      return state;
  }
};

export default tweetReducer;
