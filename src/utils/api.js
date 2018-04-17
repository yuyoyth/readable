//服务器地址
const api = 'http://localhost:3001';

let token = localStorage.token;
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8);

const headers = {
  'Authorization': token
};
const pushHeaders = {
  ...headers,
  'Content-Type': 'application/json'
};

export const getCategories = () =>
  fetch(`${api}/categories`, {headers})
    .then(res => res.json());

export const getPostsByCategory = (category) =>
  fetch(`${api}/${category}/posts`, {headers})
    .then(res => res.json());

export const getPosts = () =>
  fetch(`${api}/posts`, {headers})
    .then(res => res.json());

export const addPost = ({id, timestamp, title, body, author, category}) =>
  fetch(`${api}/posts`,{
    method: 'POST',
    headers: pushHeaders,
    body: JSON.stringify({id, timestamp, title, body, author, category})
  }).then(res => res.json());

export const getPost = (id) =>
  fetch(`${api}/posts/${id}`, {headers})
    .then(res => res.json());

export const votePost = (id, option) =>
  fetch(`${api}/posts/${id}`,{
    method: 'POST',
    headers: pushHeaders,
    body: JSON.stringify({option: option ? 'upVote' : 'downVote'})
  }).then(res => res.json());

export const editPost = (id, {title, body}) =>
  fetch(`${api}/posts/${id}`,{
    method: 'PUT',
    headers: pushHeaders,
    body: JSON.stringify({title, body})
  }).then(res => res.json());

export const deletePost = (id) =>
  fetch(`${api}/posts/${id}`,{
    method: 'DELETE',
    headers: headers,
  }).then(res => res.json());

export const getCommentsByPost = (id) =>
  fetch(`${api}/posts/${id}/comments`, {headers})
    .then(res => res.json());

export const addComment = ({id, timestamp, body, author, parentId}) =>
  fetch(`${api}/comments`,{
    method: 'POST',
    headers: pushHeaders,
    body: JSON.stringify({id, timestamp, body, author, parentId})
  }).then(res => res.json());

export const getComment = (id) =>
  fetch(`${api}/comments/${id}`, {headers})
    .then(res => res.json());

export const voteComment = (id, option) =>
  fetch(`${api}/comments/${id}`,{
    method: 'POST',
    headers: pushHeaders,
    body: JSON.stringify({option: option ? 'upVote' : 'downVote'})
  }).then(res => res.json());

export const editComment = (id, {timestamp, body}) =>
  fetch(`${api}/comments/${id}`,{
    method: 'PUT',
    headers: pushHeaders,
    body: JSON.stringify({timestamp, body})
  }).then(res => res.json());

export const deleteComment = (id) =>
  fetch(`${api}/comments/${id}`,{
    method: 'DELETE',
    headers: headers,
  }).then(res => res.json());