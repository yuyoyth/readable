import {combineReducers} from 'redux'
import post from './PostReducer'
import comment from './CommentReducer'
import userName from './UserNameReducer'
import categories from './CategoryReducer'

export default combineReducers({
  post,
  comment,
  userName,
  categories,
})