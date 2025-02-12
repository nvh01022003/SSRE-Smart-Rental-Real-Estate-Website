import axios from 'axios';
import actionTypes from './actionTypes';

// Manage posts
export const fetchPostsAdmin = (token) => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:5000/api/v1/admin/showAllPost', {
            headers: { 'token': `${token}` },
        });

        if (response.data.err === 0) {
            dispatch({
                type: actionTypes.FETCH_POSTS_SUCCESS,
                postsAdmin: response.data.posts,
            });
        } else {
            console.error('Error fetching users:', response.data.msg);
        }
    } catch (error) {
        console.error('Error during API request:', error);
    }
};

export const deletePost = (postId, token, email, reasonDeletePost) => async (dispatch) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/v1/admin/deletePost/${postId}`, {
            headers: { 'token': token },
            data: {
                email,
                reasonDeletePost
            }
        });

        if (response.data.err === 0) {
            dispatch({ type: actionTypes.DELETE_POST_SUCCESS, payload: postId });
        } else {
            console.error('Error deleting user:', response.data.msg);
        }
    } catch (error) {
        console.error('Error during API request:', error);
    }
};


// Manage users 
export const fetchUsers = (token) => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:5000/api/v1/admin/showAllUser', {
            headers: { 'token': `${token}` },
        });

        if (response.data.err === 0) {
            dispatch({
                type: actionTypes.FETCH_USERS_SUCCESS,
                payload: response.data.info_user,
            });
        } else {
            console.error('Error fetching users:', response.data.msg);
        }
    } catch (error) {
        console.error('Error during API request:', error);
    }
};

export const deleteUser = (userId, token, email, reasonDeleteUser) => async (dispatch) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/v1/admin/deleteUser/${userId}`, {
            headers: { 'token': token },
            data: {
                email,
                reasonDeleteUser
            }
        });

        if (response.data.err === 0) {
            dispatch({ type: actionTypes.DELETE_USER_SUCCESS, payload: userId });
        } else {
            console.error('Error deleting user:', response.data.msg);
        }
    } catch (error) {
        console.error('Error during API request:', error);
    }
};

export const updateUser = (userId, data, token) => async (dispatch) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/v1/admin/updateUser/${userId}`, data, {
            headers: { 'token': token }
        });
        console.log(response);
        if (response.data.err === 0) {
            dispatch({ type: actionTypes.UPDATE_USER_SUCCESS, payload: response.data.msg });
        } else {
            console.error('Error updating user:', response.data.msg);
            throw new Error(response.data.msg); // Throw an error to be caught in the calling function
        }
    } catch (error) {
        console.error('Error during API request:', error);
        throw error; // Re-throw the error to be handled in the calling function
    }
};

export const showDetailUser = async (userId, token) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/v1/admin/showDetailUser/${userId}`, {
            headers: {
                'token': `${token}`,
            }
        });

        if (response.data.err === 0) {
            console.log('Show detail user by id successfully:', response.data);
            return response.data.info_user;
        } else {
            console.error('Error show detail user:', response.data);
        }
    } catch (error) {
        console.error('Error during API request:', error);
    }
};


// Manage categories

export const fetchCategories = (token) => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:5000/api/v1/auth/category');
        if (response.data.err === 0) {
            dispatch({
                type: actionTypes.GET_CATEGORIES,
                data: { categories: response.data.msg },
            });
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

export const createCategory = (categoryName, token) => async (dispatch) => {
    try {
        // Ensure the payload is correctly structured
        const payload = {
            category_name: categoryName.category_name,
        };
        const response = await axios.post('http://localhost:5000/api/v1/admin/createCategory', payload, {
            headers: { 'token': `${token}` },
        });
        // if (response.data.err === 0) {
        //     dispatch(fetchCategories());
        // }
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error; // Re-throw the error to be handled in the calling function
    }
};

export const updateCategory = (categoryId, categoryData, token) => async (dispatch) => {
    try {
        // Ensure the payload is correctly structured
        const payload = {
            category_name: categoryData.category_name,
        };
        const response = await axios.put(`http://localhost:5000/api/v1/admin/updateCategory/${categoryId}`, payload, {
            headers: { 'token': `${token}` },
        });
        //console.log(response);
        // if (response.data.err === 0) {
        //     dispatch(fetchCategories());
        // }
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error; // Re-throw the error to be handled in the calling function
    }
};

export const deleteCategory = (categoryId, token) => async (dispatch) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/v1/admin/deleteCategory/${categoryId}`, {
            headers: { 'token': `${token}` },
        });
        // if (response.data.err === 0) {
        //     dispatch(fetchCategories());
        // }
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
    }
};

// Manage upgrade requests
export const fetchUpgradeRequests = (token, page) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/v1/admin/showAllUpgradeRequest?page=${page}`, {
            headers: {
                'token': `${token}`
            }
        });
        if (response.data.err === 0) {
            dispatch({
                type: actionTypes.FETCH_UPGRADE_REQUESTS_SUCCESS,
                payload: response.data.res,
                pagination: response.data.pagination
            });
        } else {
            dispatch({
                type: actionTypes.FETCH_UPGRADE_REQUESTS_FAILURE,
                payload: response.data.msg
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.FETCH_UPGRADE_REQUESTS_FAILURE,
            payload: error.message
        });
    }
};

// Fetch All Type Posts with Pagination
export const fetchTypePosts = (token, page = 1) => async (dispatch) => {
    dispatch({ type: actionTypes.FETCH_TYPE_POSTS_REQUEST });
    try {
        const response = await axios.get(`http://localhost:5000/api/v1/admin/showAllTypePost?page=${page}`, {
            headers: {
                'token': `${token}`,
            },
        });
        if (response.data.err === 0) {
            dispatch({
                type: actionTypes.FETCH_TYPE_POSTS_SUCCESS,
                payload: response.data.postType,
                pagination: response.data.pagination,
            });
        } else {
            dispatch({
                type: actionTypes.FETCH_TYPE_POSTS_FAILURE,
                payload: response.data.msg || 'Error fetching type posts.',
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.FETCH_TYPE_POSTS_FAILURE,
            payload: error.message || 'Error fetching type posts.',
        });
    }
};

// Create a New Type Post
export const createTypePost = (token, name, price) => async (dispatch) => {
    dispatch({ type: actionTypes.CREATE_TYPE_POST_REQUEST });
    try {
        const response = await axios.post(
            'http://localhost:5000/api/v1/admin/createTypePost',
            { name, price },
            {
                headers: {
                    'token': `${token}`,
                },
            }
        );
        if (response.data.err === 0) {
            dispatch({
                type: actionTypes.CREATE_TYPE_POST_SUCCESS,
                payload: response.data.postType,
            });
        } else {
            dispatch({
                type: actionTypes.CREATE_TYPE_POST_FAILURE,
                payload: response.data.msg || 'Error creating type post.',
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.CREATE_TYPE_POST_FAILURE,
            payload: error.message || 'Error creating type post.',
        });
    }
};

// Update an Existing Type Post
export const updateTypePost = (token, typePostId, name, price) => async (dispatch) => {
    dispatch({ type: actionTypes.UPDATE_TYPE_POST_REQUEST });
    try {
        const response = await axios.put(
            `http://localhost:5000/api/v1/admin/updateTypePost/${typePostId}`,
            { name, price },
            {
                headers: {
                    'token': `${token}`,
                },
            }
        );
        if (response.data.err === 0) {
            dispatch({
                type: actionTypes.UPDATE_TYPE_POST_SUCCESS,
                payload: response.data.postType,
            });
        } else {
            dispatch({
                type: actionTypes.UPDATE_TYPE_POST_FAILURE,
                payload: response.data.msg || 'Error updating type post.',
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.UPDATE_TYPE_POST_FAILURE,
            payload: error.message || 'Error updating type post.',
        });
    }
};

// Delete a Type Post
export const deleteTypePost = (token, typePostId) => async (dispatch) => {
    dispatch({ type: actionTypes.DELETE_TYPE_POST_REQUEST });
    try {
        const response = await axios.delete(
            `http://localhost:5000/api/v1/admin/deleteTypePost/${typePostId}`,
            {
                headers: {
                    'token': `${token}`,
                },
            }
        );
        if (response.data.err === 0) {
            dispatch({
                type: actionTypes.DELETE_TYPE_POST_SUCCESS,
                payload: typePostId,
            });
        } else {
            dispatch({
                type: actionTypes.DELETE_TYPE_POST_FAILURE,
                payload: response.data.msg || 'Error deleting type post.',
            });
        }
    } catch (error) {
        dispatch({
            type: actionTypes.DELETE_TYPE_POST_FAILURE,
            payload: error.message || 'Error deleting type post.',
        });
    }
};