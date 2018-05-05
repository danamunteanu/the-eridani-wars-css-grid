import { SET_ANSWERS, RESET_ANSWERS } from '../types/answers';
const initState = {
    answers: {}
}
export default (state = initState, action) => {
    switch(action.type) {
        case SET_ANSWERS :
            return {...state, answers: action.payload.answers}
        case RESET_ANSWERS :
            return {...state, answers: {}}
    default :
    return state
    }
}