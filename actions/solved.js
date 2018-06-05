import { SET_SOLVED, RESET_SOLVED } from '../types/solved'
export const setSolved = (solved) => {
  return dispatch => {
    dispatch({
      type: SET_SOLVED,
      payload: {
        solved
      }
    })
  }
}

export const resetSolved = () => {
  return dispatch => {
    dispatch({
      type: RESET_SOLVED
    })
  }
}