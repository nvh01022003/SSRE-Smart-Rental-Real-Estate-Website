import actionTypes from "../actions/actionTypes";

const initialState = {
    users: [],
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_USERS_SUCCESS:
            return {
                ...state,
                users: action.payload,
            };
        case actionTypes.DELETE_USER_SUCCESS:
            return {
                ...state,
                users: state.users.filter(user => user.id !== action.payload),
            };
        case actionTypes.UPDATE_USER_SUCCESS:
            return {
                ...state,
                users: state.users.map(user => user.id === action.payload.id ? action.payload : user),
            };
        default:
            return state;
    }
};

export default adminReducer;