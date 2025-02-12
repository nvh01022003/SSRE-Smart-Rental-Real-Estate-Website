import actionTypes from "../actions/actionTypes";

const initState = {
    user: null,
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER_INFO:
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
}

export default userReducer
