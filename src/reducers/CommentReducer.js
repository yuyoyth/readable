import {
  INIT_POST_TO_COMMENT,
  ADD_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT,
  VOTE_COMMENT
} from '../actions/CommentActions'
import {DELETE_POST} from '../actions/PostActions'

const initialState = {
  postsToComments: {},
  comments: {}
};

export default function (state = initialState, action) {
  let action_programs = {
    [INIT_POST_TO_COMMENT]: () => initPostToComments(state, action.postId, action.comments),
    [ADD_COMMENT]: () => addComment(state, action),
    [EDIT_COMMENT]: () => editComment(state, action),
    [DELETE_COMMENT]: () => deleteComment(state, action.id),
    [VOTE_COMMENT]: () => voteComment(state, action),
    [DELETE_POST]: () => deletePost(state, action.id),
  };
  return action_programs.hasOwnProperty(action.type) ? action_programs[action.type]() : state
}

/**
 * 初始化帖子对应的评论id列表postsToComments，并保存评论至comments
 * @param state
 * @param postId 帖子id
 * @param comments 属于帖子的评论列表
 * @returns {*}
 */
const initPostToComments = (state, postId, comments) => {
  let newState = {...state};
  !newState.postsToComments.hasOwnProperty(postId) && (newState.postsToComments[postId] = {});
  return comments.reduce(
    (result, comment) => {
      const {id, timestamp, body, author, parentId, voteScore, deleted} = comment;
      if (deleted) return result;
      result.postsToComments[postId][id] = true;
      result.comments[id] = {id, timestamp, body, author, parentId, voteScore};
      return result
    }, newState
  )
};

/**
 * 添加新评论
 * @param state
 * @param id 评论id
 * @param timestamp 时间戳
 * @param body 评论内容
 * @param author 评论作者
 * @param parentId 所属帖子id
 * @returns {{postsToComments: {}, comments: {}}}
 */
const addComment = (state, {id, timestamp, body, author, parentId}) => ({
  ...state,
  postsToComments: {
    ...state.postsToComments,
    [parentId]: state.postsToComments.hasOwnProperty(parentId) ? {
      ...state.postsToComments[parentId],
      [id]: true
    } : {
      [id]: true
    },
  },
  comments: {
    ...state.comments,
    [id]: {
      id, timestamp, body, author, parentId,
      voteScore: 1
    },
  },
});

/**
 * 编辑已有评论
 * @param state
 * @param id 评论id
 * @param timestamp 时间戳
 * @param body 评论内容
 * @returns {{comments: {}}}
 */
const editComment = (state, {id, timestamp, body}) => ({
  ...state,
  comments: {
    ...state.comments,
    [id]: {
      ...state.comments[id],
      timestamp, body
    },
  },
});

/**
 * 删除评论
 * @param state
 * @param id 评论id
 * @returns {{postsToComments: {}, comments: {}}}
 */
const deleteComment = (state, id) => ({
  postsToComments: {
    ...state.postsToComments,
    [state.comments[id].parentId]: Object.entries(state.postsToComments[state.comments[id].parentId]).reduce(
      (result, [k, v]) => {
        k !== id && (result[k] = v);
        return result
      }, {}
    )
  },
  comments: Object.entries(state.comments).reduce(
    (result, [k, v]) => {
      k !== id && (result[k] = v);
      return result
    }, {}
  )
});

/**
 * 为评论投票
 * @param state
 * @param id 评论id
 * @param option true-增票，false-减票
 * @returns {{comments: {}}}
 */
const voteComment = (state, {id, option}) => ({
  ...state,
  comments: {
    ...state.comments,
    [id]: {
      ...state.comments[id],
      voteScore: option ? state.comments[id].voteScore+1 : state.comments[id].voteScore-1
    },
  },
});

/**
 * 帖子删除时联动清空所属评论
 * @param state
 * @param parentId 删除的帖子id
 * @returns {{}}
 */
const deletePost = (state, parentId) => {
  const commentIds = Object.keys(state.postsToComments[parentId]);
  let newState = {...state};
  commentIds.forEach(e => delete newState.comments[e]);
  delete newState.postsToComments[parentId];
  return newState
};