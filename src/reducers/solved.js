import { SET_SOLVED, RESET_SOLVED } from '../types/solved'
const initState = {
  solved: []
}
export default (state = initState, action) => {
  switch(action.type) {
    case SET_SOLVED :
      return {...state, solved: action.payload.solved}
    case RESET_SOLVED :
      return {...state, solved: []}
    default :
      return state
  }
}