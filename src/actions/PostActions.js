export const INIT_POST = 'INIT_POST';
export const ADD_POST = 'ADD_POST';
export const EDIT_POST = 'EDIT_POST';
export const DELETE_POST = 'DELETE_POST';
export const VOTE_POST = 'VOTE_POST';
export const COMPLETED_ADD_COMMENT = 'COMPLETED_ADD_COMMENT';
export const COMPLETED_DELETE_COMMENT = 'COMPLETED_DELETE_COMMENT';

export const initPost = (posts) => ({
  type: INIT_POST,
  posts
});

export const addPost = ({id, timestamp, title, body, author, category}) => ({
  type: ADD_POST,
  id, timestamp, title, body, author, category
});

export const editPost = ({id, title, body}) => ({
  type: EDIT_POST,
  id, title, body
});

export const deletePost = (id) => ({
  type: DELETE_POST, id
});

export const votePost = ({id, option}) => ({
  type: VOTE_POST, id, option
});

export const completeAddComment = (id) => ({
  type: COMPLETED_ADD_COMMENT, id
});

export const completeDeleteComment = (id) => ({
  type: COMPLETED_DELETE_COMMENT, id
});