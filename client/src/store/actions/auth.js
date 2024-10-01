import actionTypes from './actionTypes'
import { apiRegister, apiLogin } from '../../services/auth'

export const register = (payload) => async (dispatch) => {
    try {
        const response = await apiRegister(payload)
        console.log('Register Response:', response); // Log the response
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.REGISTER_SUCCESS,
                data: response.data
            })
        } else {
            dispatch({
                type: actionTypes.REGISTER_FAIL,
                data: response.data.msg
            })
        }

    } catch (error) {
        console.error('Register Action Error:', error); // Log detailed error
        dispatch({
            type: actionTypes.REGISTER_FAIL,
            data: null
        })
    }
}
export const login = (payload) => async (dispatch) => {
    try {
        const response = await apiLogin(payload)
        console.log('Login Response:', response); // Log the response
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: response.data.token
            })
        } else {
            dispatch({
                type: actionTypes.LOGIN_FAIL,
                data: response.data.msg
            })
        }

    } catch (error) {
        console.error('Login Action Error:', error); // Log detailed error
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            data: null
        })
    }
}

export const logout = () => ({
    type: actionTypes.LOGOUT
})