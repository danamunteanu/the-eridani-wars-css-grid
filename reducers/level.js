import { SET_LEVEL } from '../types/level'
const initState = {
  level: 0
}
export default (state = initState, action) => {
  switch(action.type) {
    case SET_LEVEL :
      return {...state, level: action.payload.level}
    default :
      return state
  }
}