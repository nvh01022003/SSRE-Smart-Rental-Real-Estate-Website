import actionTypes from './actionTypes'
import { apiGetNewPosts, apiGetPosts, apiGetPostsLimit, apiSavePost } from '../../services/post'

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
export const getPostsLimit = (query) => async (dispatch) => {
    try {
        const response = await apiGetPostsLimit(query)
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.GET_POSTS_LIMIT,
                posts: response.data.response?.rows,
                count: response.data.response?.count
            })
        } else {
            dispatch({
                type: actionTypes.GET_POSTS_LIMIT,
                msg: response.data.msg
            })
        }

    } catch (error) {
        dispatch({
            type: actionTypes.GET_POSTS_LIMIT,
            posts: null
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
// Action để lưu bài viết
export const savePost = (postId, token) => async (dispatch) => {
    try {
        const response = await apiSavePost(postId, token);  // Gọi API từ FE tới BE
        console.log('Save Post Action Response:', response);

        // Nếu lưu bài viết thành công
        if (response?.err === 0) {
            dispatch({
                type: actionTypes.SAVE_POST_SUCCESS,
                data: response.msg  // Truyền dữ liệu thành công
            });
            return response;  // Trả về dữ liệu cho component (nếu cần)
        } else {
            // Nếu lưu bài viết thất bại
            dispatch({
                type: actionTypes.SAVE_POST_FAIL,
                data: response.msg || 'Save post failed'
            });
        }
    } catch (error) {
        console.error('Save Post Action Error:', error);
        dispatch({
            type: actionTypes.SAVE_POST_FAIL,
            data: error.msg || 'An error occurred while saving the post'
        });
        throw error;  // Ném lỗi ra component để hiển thị cho người dùng
    }
};