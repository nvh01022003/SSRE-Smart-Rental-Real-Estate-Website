import actionTypes from "../actions/actionTypes";

const initialState = {
    users: [],
    upgradeRequests: [],
    pagination: {},
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



        case actionTypes.FETCH_UPGRADE_REQUESTS_SUCCESS:
            return {
                ...state,
                upgradeRequests: action.payload,
                pagination: action.pagination,
                error: null
            };
        case actionTypes.FETCH_UPGRADE_REQUESTS_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export default adminReducer;