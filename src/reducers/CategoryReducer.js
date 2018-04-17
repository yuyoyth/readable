import {INIT_CATEGORIES} from '../actions/CategoryAction'

export default function (state = {}, action) {
  let action_programs = {
    [INIT_CATEGORIES]: () => initCategories(action.categories),
  };
  return action_programs.hasOwnProperty(action.type) ? action_programs[action.type]() : state
}

const initCategories = (categories) => Object.values(categories).reduce(
  (result, v) => {
    v.forEach(e => result[e.name] = e.path);
    return result
  }, {}
);