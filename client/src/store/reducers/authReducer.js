import actionTypes from "../actions/actionTypes";


const initState = {
    isLoggedIn: false,
    token: null,
    error: null,
    role: null,
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.VERIFY_SUCCESS:
            {
                return {
                    ...state,
                    error: null,
                }
            }
        case actionTypes.REGISTER_SUCCESS:
            {
                return {
                    ...state,
                    error: null,
                }
            }
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                token: action.token,
                error: null,
            }
        case actionTypes.REGISTER_FAIL:
        case actionTypes.LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                token: null,
                user: null,
                error: action.data,
            }
        case actionTypes.LOGOUT:
            localStorage.removeItem('user');
            return {
                ...state,
                isLoggedIn: false,
                token: null,
                user: null,
                role: null
            }
        case actionTypes.SET_USER_ROLE:
            return {
                ...state,
                role: action.data.msg,
            };
        default:
            return state;
    }
}

export default authReducer