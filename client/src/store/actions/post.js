import actionTypes from './actionTypes'
import { apiGetNewPosts, apiGetPosts, apiGetPostsLimit } from '../../services/post'
import axios from 'axios'

export const getPosts = () => async (dispatch) => {
    try {
        const response = await apiGetPosts()
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.GET_POSTS,
                posts: response.data.response
            })
        } else {
            dispatch({
                type: actionTypes.GET_POSTS,
                msg: response.data.msg
            })
        }

    } catch (error) {
        dispatch({
            type: actionTypes.GET_POSTS,
            posts: null
        })
    }
}
export const getPostsLimit = (params) => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:5000/api/v1/user/tenants/findPostByAll', { params });
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.GET_POSTS_LIMIT,
                posts: response.data.msg.listPost || [],  // Safeguard if rows is missing
                count: response.data?.response?.count || 0,  // Safeguard if count is missing
                msg: response.data.msg.listPost || 'No posts found',  // Assuming the response format contains `listPost`
            })
        } else {
            dispatch({
                type: actionTypes.GET_POSTS_LIMIT,
                posts: [],
                msg: response.data?.msg || 'An error occurred',
            })
        }

    } catch (error) {
        dispatch({
            type: actionTypes.GET_POSTS_LIMIT,
            posts: [],
            msg: 'Failed to fetch posts, please try again later.'
        })
    }
}
export const getNewPosts = () => async (dispatch) => {
    try {
        const response = await apiGetNewPosts()
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.GET_NEW_POST,
                newPosts: response.data.response,
            })
        } else {
            dispatch({
                type: actionTypes.GET_NEW_POST,
                msg: response.data.msg,
                newPosts: null
            })
        }

    } catch (error) {
        dispatch({
            type: actionTypes.GET_NEW_POST,
            newPosts: null
        })
    }
}