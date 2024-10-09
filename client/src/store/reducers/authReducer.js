import actionTypes from "../actions/actionTypes";

const initState = {
    isLoggedIn: false,
    //JSON.parse(localStorage.getItem('isLoggedIn')) ||
    token: null,
    //localStorage.getItem('token') ||
    user: null,
    //JSON.parse(localStorage.getItem('user')) ||
    error: null,
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.VERIFY_SUCCESS:
            {
                //localStorage.setItem('isLoggedIn', true);
                return {
                    ...state,
                    //isLoggedIn: true,
                    error: null,
                    //token: action.data.token,
                }
            }
        case actionTypes.REGISTER_SUCCESS:
            {
                //localStorage.setItem('isLoggedIn', true);
                return {
                    ...state,
                    //isLoggedIn: true,
                    error: null,
                }
            }
        case actionTypes.LOGIN_SUCCESS:
            //localStorage.setItem('isLoggedIn', true);
            //localStorage.setItem('token', action.data.token); // Lưu token vào localStorage
            //localStorage.setItem('user', JSON.stringify(action.data.user));   // Lưu user vào localStorage
            return {
                ...state,
                isLoggedIn: true,
                token: action.data.token,
                user: action.data.user,
                error: null,
                currentData: action.data.user, // Cập nhật currentData với thông tin từ user
            }
        case actionTypes.REGISTER_FAIL:
        case actionTypes.LOGIN_FAIL:
            //localStorage.setItem('isLoggedIn', false);
            //localStorage.setItem('token', null);
            //localStorage.setItem('user', null);
            return {
                ...state,
                isLoggedIn: false,
                token: null,
                user: null,
                error: action.data,
            }
        case actionTypes.LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                token: null,
                user: null,
            }

        default:
            return state;
    }
}

export default authReducer