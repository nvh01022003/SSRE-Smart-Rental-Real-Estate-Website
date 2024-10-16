import actionTypes from './actionTypes'
//import * as apis from '../../services'


export const getCurrent = () => async (dispatch) => {
    try {
        const user = localStorage.getItem('user');
        console.log(user);

        if (user) {
            dispatch({
                type: actionTypes.GET_CURRENT,
                currentData: user
            });
            //console.log(user);
        } else {
            dispatch({
                type: actionTypes.GET_CURRENT,
                msg: 'No user found',
                currentData: null
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_CURRENT,
            currentData: null,
            msg: error.message,
        });
    }
}