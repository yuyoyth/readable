import {EDIT_NAME} from '../actions/UserNameAction'

export default function (state = localStorage.userName ? localStorage.userName : '', action) {
  let action_programs = {
    [EDIT_NAME]: ()=> editName(state, action.newName),
  };
  return action_programs.hasOwnProperty(action.type) ? action_programs[action.type]() : state
}

const editName = (state, newName) => {
  if (state === newName) return state;
  localStorage.userName = newName;
  return newName;
};