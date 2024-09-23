import actionTypes from "../actions/actionTypes";

const initState = {
    isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
    token: localStorage.getItem('token') || null,
    // msg: '',
    // update: false
    user: JSON.parse(localStorage.getItem('user')) || null,
    error: null,
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.REGISTER_SUCCESS:
        case actionTypes.LOGIN_SUCCESS:
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            return {
                ...state,
                isLoggedIn: true,
                token: action.payload.token,
                // msg: ''
                user: action.payload.user,
                error: null,
            }
        case actionTypes.REGISTER_FAIL:
        case actionTypes.LOGIN_FAIL:
            localStorage.setItem('isLoggedIn', false);
            localStorage.setItem('token', null);
            localStorage.setItem('user', null);
            return {
                ...state,
                isLoggedIn: false,
                // msg: action.data,
                token: null,
                // update: !state.update
                user: null,
                error: action.payload,
            }
        case actionTypes.LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                token: null,
                // msg: ''
                user: null,
                error: null,
            }
        case 'LOGIN':
            return {
                ...state,
                isLoggedIn: true,
                token: action.payload
            };
        default:
            return state;
    }
}

export default authReducer