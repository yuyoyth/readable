import {INIT_CATEGORIES} from '../actions/CategoryAction'

export default function (state = {}, action) {
  let action_programs = {
    [INIT_CATEGORIES]: () => initCategories(action.categories),
  };
  return action_programs.hasOwnProperty(action.type) ? action_programs[action.type]() : state
}

/**
 * 初始化类别数据
 * @param categories 类别对象数组
 * @returns {any}
 */
const initCategories = (categories) => Object.values(categories).reduce(
  (result, v) => {
    v.forEach(e => result[e.name] = e.path);
    return result
  }, {}
);