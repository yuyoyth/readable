export const INIT_POST_TO_COMMENT = 'INIT_POST_TO_COMMENT';
export const ADD_COMMENT = 'ADD_COMMENT';
export const EDIT_COMMENT = 'EDIT_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const VOTE_COMMENT = 'VOTE_COMMENT';

export const initPostToComment = (postId, comments) => ({
  type: INIT_POST_TO_COMMENT, postId, comments
});

export const addComment = ({id, timestamp, body, author, parentId}) => ({
  type: ADD_COMMENT,
  id, timestamp, body, author, parentId
});

export const editComment = ({id, timestamp, body}) => ({
  type: EDIT_COMMENT,
  id, timestamp, body
});

export const deleteComment = (id) => ({
  type: DELETE_COMMENT, id
});

export const voteComment = ({id, option}) => ({
  type: VOTE_COMMENT, id, option
});