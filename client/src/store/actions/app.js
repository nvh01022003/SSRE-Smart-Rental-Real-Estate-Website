import actionTypes from './actionTypes'
import axios from 'axios';


export const getCategories = () => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:5000/api/v1/auth/category');
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.GET_CATEGORIES,
                data: {
                    categories: response.data.msg,
                    msg: response.data.msg
                }
            })
        } else {
            dispatch({
                type: actionTypes.GET_CATEGORIES,
                msg: response.data.msg,
                categories: null
            })
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        dispatch({
            type: actionTypes.GET_CATEGORIES,
            data: {
                categories: [],
                msg: 'Error fetching categories'
            }
        });
    }
}
