import actionTypes from './actionTypes'
import * as apis from '../../services'

export const setUserInfo = (token) => async (dispatch) => {

    try {
        const response = await apis.setUserInfo(token)
        if (response.err === 0) {
            dispatch({
                type: actionTypes.SET_USER_INFO,
                payload: response.info_user
            })
        } else {
            dispatch({
                type: actionTypes.SET_USER_INFO,
                payload: null
            })
        }
    } catch (error) {
        dispatch({
            type: actionTypes.SET_USER_INFO,
            payload: null
        })
    }
}