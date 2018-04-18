import {EDIT_NAME} from '../actions/UserNameAction'

export default function (state = localStorage.userName ? localStorage.userName : '', action) {
  let action_programs = {
    [EDIT_NAME]: () => editName(state, action.newName),
  };
  return action_programs.hasOwnProperty(action.type) ? action_programs[action.type]() : state
}

/**
 * 更新用户名
 * @param state 旧状态
 * @param newName 新用户名
 * @returns {*}
 */
const editName = (state, newName) => {
  if (state === newName) return state;
  //存储在本地，方便下次加载
  localStorage.userName = newName;
  return newName;
};