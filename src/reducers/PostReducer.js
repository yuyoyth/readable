import {
  INIT_POST,
  ADD_POST,
  EDIT_POST,
  DELETE_POST,
  VOTE_POST,
  COMPLETED_ADD_COMMENT,
  COMPLETED_DELETE_COMMENT
} from '../actions/PostActions'

const initialState = {
  categoriesToPost: {},
  posts: {}
};

export default function (state = initialState, action) {
  let action_programs = {
    [INIT_POST]: ()=> init(action.posts),
    [ADD_POST]: ()=> addPost(state, action),
    [EDIT_POST]: ()=> editPost(state, action),
    [DELETE_POST]: ()=> deletePost(state, action.id),
    [VOTE_POST]: ()=> votePost(state, action),
    [COMPLETED_ADD_COMMENT]: ()=> completeAddOrDeleteComment(state, action.id, true),
    [COMPLETED_DELETE_COMMENT]: ()=> completeAddOrDeleteComment(state, action.id, false),
  };
  return action_programs.hasOwnProperty(action.type) ? action_programs[action.type]() : state
}

/**
 * 初始化所有帖子
 * @param posts 帖子数组
 * @returns {*}
 */
const init = (posts) => posts.reduce(
  (result, post) => {
    const {id, timestamp, title, body, author, category, voteScore, commentCount, deleted} = post;
    if (deleted) return result;
    !result.categoriesToPost.hasOwnProperty(category) && (result.categoriesToPost[category] = {});
    result.categoriesToPost[category][id] = true;
    result.posts[id] = {id, timestamp, title, body, author, category, voteScore, commentCount};
    return result
  }, {...initialState}
);

/**
 * 添加帖子
 * @param state
 * @param id 帖子id
 * @param timestamp 时间戳
 * @param title 标题
 * @param body 内容
 * @param author 作者
 * @param category 类别
 * @returns {{categoriesToPost: {}, posts: {}}}
 */
const addPost = (state, {id, timestamp, title, body, author, category}) => ({
  ...state,
  categoriesToPost: {
    ...state.categoriesToPost,
    [category]: state.categoriesToPost.hasOwnProperty(category) ? {
      ...state.categoriesToPost[category],
      [id]: true
    } : {
      [id]: true
    }
  },
  posts: {
    ...state.posts,
    [id]: {
      id, timestamp, title, body, author, category,
      voteScore: 1,
      commentCount: 0
    },
  },
});

/**
 * 编辑帖子
 * @param state
 * @param id 帖子id
 * @param title 标题
 * @param body 内容
 * @returns {{posts: {}}}
 */
const editPost = (state, {id, title, body}) => ({
  ...state,
  posts: {
    ...state.posts,
    [id]: {
      ...state.posts[id],
      title, body
    },
  },
});

/**
 * 删除帖子
 * @param state
 * @param id 帖子id
 * @returns {{categoriesToPost: {}, posts: {}}}
 */
const deletePost = (state, id) => ({
  categoriesToPost: {
    ...state.categoriesToPost,
    [state.posts[id].category]: Object.entries(state.categoriesToPost[state.posts[id].category]).reduce(
      (result, [k, v]) => {
        k !== id && (result[k] = v);
        return result
      }, {}
    )
  },
  posts: Object.entries(state.posts).reduce(
    (result, [k, v]) => {
      k !== id && (result[k] = v);
      return result
    }, {}
  )
});

/**
 * 为帖子投票
 * @param state
 * @param id 帖子id
 * @param option true-增票，false-减票
 * @returns {{posts: {}}}
 */
const votePost = (state, {id, option}) => ({
  ...state,
  posts: {
    ...state.posts,
    [id]: {
      ...state.posts[id],
      voteScore: option ? state.posts[id].voteScore+1 : state.posts[id].voteScore-1
    },
  },
});

/**
 * 帖子添加或删除评论时，修改包含的评论数
 * @param state
 * @param id 帖子id
 * @param commentCountUp true-评论数+1，false-评论数-1
 * @returns {{posts: {}}}
 */
const completeAddOrDeleteComment = (state, id, commentCountUp) => ({
  ...state,
  posts: {
    ...state.posts,
    [id]: {
      ...state.posts[id],
      commentCount: commentCountUp ? state.posts[id].commentCount+1 : state.posts[id].commentCount-1
    }
  }
});