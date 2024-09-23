import actionTypes from './actionTypes';
import axios from 'axios';


export const login = (payload) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:5000/api/v1/auth/login', payload);
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch({
            type: actionTypes.LOGIN_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            payload: error.response?.data?.message || 'Login failed',
        });
    }
};

export const register = (payload) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:5000/api/v1/auth/register', payload);
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch({
            type: actionTypes.LOGIN_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            payload: error.response?.data?.message || 'Registration failed',
        });
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem('user');
    dispatch({ type: actionTypes.LOGOUT });
};

export const loginSuccess = (data) => {
    return {
        type: actionTypes.LOGIN_SUCCESS,
        payload: {
            token: data.token,
            user: data.user,
        },
    };
};

export const loginFail = (error) => {
    return {
        type: actionTypes.LOGIN_FAIL,
        payload: error,
    };
};

export const registerSuccess = (data) => {
    return {
        type: actionTypes.REGISTER_SUCCESS,
        payload: {
            token: data.token,
            user: data.user,
        },
    };
};

export const registerFail = (error) => {
    return {
        type: actionTypes.REGISTER_FAIL,
        payload: error,
    };
};