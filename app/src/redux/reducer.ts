import { combineReducers } from "redux";

interface MemberState {
    member: {}
}
interface MemberAction {
    type:string,
    payload : {},
}
const memberReducer = (state:MemberState = {member:{}}, action: MemberAction) => {
    switch (action.type) {
        case "loginMember" :
            return {...state, member:action.payload};
        case "logoutMember" :
            return {...state, member: {}};
        default : 
            return state;
    }
}

interface BoardState {
    board: []
}
interface BoardAction {
    type:string,
    payload : [],
}
const boardReducer = (state:BoardState = {board: []}, action: BoardAction) => {
    switch (action.type) {
        case "setBoard" :
            return {...state, board: action.payload};
        default : 
            return state;
    }
}

const reducers = combineReducers({
    memberReducer,
    boardReducer,
})

export default reducers