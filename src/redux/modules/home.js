import { combineReducers} from "redux"
import { get } from "../../utils/request";
import url from "../../utils/url";
import { FETCH_DATA } from "../middleware/api";
import { schema } from "./entities/products";

// 分页用到的常量
export const params = {
  // 超值特惠分页
  PATH_DISCOUNTS: "discounts",
  PAGE_SIZE_DISCOUNTS: 3,
  // 猜你喜欢分页
  PATH_LIKES: "likes",
  PAGE_SIZE_LIKES: 5
};

// Action类型常量
export const types = {
  //获取超值特惠请求
  FETCH_DISCOUNTS_REQUEST: "HOME/FETCH_DISCOUNTS_REQUEST",
  //获取超值特惠请求成功
  FETCH_DISCOUNTS_SUCCESS: "HOME/FETCH_DISCOUNTS_SUCCESS",
  //获取超值特惠请求失败
  FETCH_DISCOUNTS_FAILURE: "HOME/FETCH_DISCOUNTS_FAILURE",
  //获取猜你喜欢请求
  FETCH_LIKES_REQUEST: "HOME/FETCH_LIKES_REQUEST",
  //获取猜你喜欢请求成功
  FETCH_LIKES_SUCCESS: "HOME/FETCH_LIKES_SUCCESS",
  //获取猜你喜欢请求失败
  FETCH_LIKES_FAILURE: "HOME/FETCH_LIKES_FAILURE"
};

// 初始状态
const initialState = {
  likes: {
    isFetching: false,
    pageCount: 0,
    ids: []
  },
  discounts: {
    isFetching: false,
    ids: []
  }
};

/****************** Action创建器 ******************/

// Action创建器:Redux-Thunk类型的Action
export const actions = {
  // 超值特惠
  loadDiscounts: () => {
    return (dispatch, getState) => {
      // 使用已前加载过的数据　
      const {ids} = getState().home.discounts
      if(ids.length > 0) {
        return null;
      }
      // 转发自定义中间件类型的Action
      const endpoint = url.getProductList(
        params.PATH_DISCOUNTS,
        0,
        params.PAGE_SIZE_DISCOUNTS
      );
      return dispatch(fetchDiscounts(endpoint));
    };
  },
  // 猜你喜欢
  loadLikes: () => {
    return (dispatch, getState) => {
      // 转发自定义中间件类型的Action
      const { pageCount } = getState().home.likes;
      const rowIndex = pageCount * params.PAGE_SIZE_LIKES;
      const endpoint = url.getProductList(
        params.PATH_LIKES,
        rowIndex,
        params.PAGE_SIZE_LIKES
      );
      return dispatch(fetchLikes(endpoint));
    };
  }
};

// Action创建器：自定义中间件类型的Action
const fetchDiscounts = endpoint => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_DISCOUNTS_REQUEST,
      types.FETCH_DISCOUNTS_SUCCESS,
      types.FETCH_DISCOUNTS_FAILURE
    ],
    endpoint,
    schema
  }
});

// Action创建器：自定义中间件类型的Action
const fetchLikes = endpoint => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_LIKES_REQUEST,
      types.FETCH_LIKES_SUCCESS,
      types.FETCH_LIKES_FAILURE
    ],
    endpoint,
    schema
  }
});

/****************** Reducers ******************/

//特惠商品Reducer
const discounts = (state = initialState.discounts, action) => {
  switch (action.type) {
    case types.FETCH_DISCOUNTS_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_DISCOUNTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: state.ids.concat(action.response.ids)
      };
    case types.FETCH_DISCOUNTS_FAILURE:
      return {...state, isFetching: false}
    default:
      return state;
  }
};

//猜你喜欢Reducer
const likes = (state = initialState.likes, action) => {
  switch (action.type) {
    case types.FETCH_LIKES_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_LIKES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        pageCount: state.pageCount + 1,
        ids: state.ids.concat(action.response.ids)
      };
    case types.FETCH_LIKES_FAILURE:
      return {...state, isFetching: false}
    default:
      return state;
  }
};

// 合并子Reducer
const reducer = combineReducers({
  discounts,
  likes
})

export default reducer;

/****************** Selectors ******************/

//获取猜你喜欢state
export const getLikes = state => {
  return state.home.likes.ids.map(id => {
    return state.entities.products[id]
  })
}

//获取特惠商品state
export const getDiscounts = state => {
  return state.home.discounts.ids.map(id => {
    return state.entities.products[id]
  })
}

//猜你喜欢当前分页码
export const getPageCountOfLikes = state => {
  return state.home.likes.pageCount
}