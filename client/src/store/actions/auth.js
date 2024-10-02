// import actionTypes from './actionTypes'
// import { apiRegister, apiLogin } from '../../services/auth'

// export const register = (payload) => async (dispatch) => {
//     try {
//         const response = await apiRegister(payload)
//         console.log('Register Response:', response); // Log the response
//         if (response?.err === 0) {
//             dispatch({
//                 type: actionTypes.REGISTER_SUCCESS,
//                 data: response
//             })
//             return response;  // Trả về `response` từ đây
//         } else {
//             dispatch({
//                 type: actionTypes.REGISTER_FAIL,
//                 data: response.msg
//             })
//             return response;  // Trả về `response` từ đây
//         }

//     } catch (error) {
//         console.error('Register Action Error:', error); // Log detailed error
//         dispatch({
//             type: actionTypes.REGISTER_FAIL,
//             data: null
//         })
//         throw error;  // Trả lỗi về nếu có lỗi xảy ra
//     }
// }
// export const login = (payload) => async (dispatch) => {
//     try {
//         const response = await apiLogin(payload)
//         console.log('Login Response:', response); // Log the response
//         if (response?.err === 0) {
//             dispatch({
//                 type: actionTypes.LOGIN_SUCCESS,
//                 data: response.token
//             })
//         } else {
//             dispatch({
//                 type: actionTypes.LOGIN_FAIL,
//                 data: response.msg
//             })
//         }

//     } catch (error) {
//         console.error('Login Action Error:', error); // Log detailed error
//         dispatch({
//             type: actionTypes.LOGIN_FAIL,
//             data: null
//         })
//     }
// }

// export const logout = () => ({
//     type: actionTypes.LOGOUT
// })

import actionTypes from './actionTypes';
import { apiRegister, apiLogin } from '../../services/auth';

// Action for user registration
export const register = (payload) => async (dispatch) => {
    try {
        const response = await apiRegister(payload);
        console.log('Register Response:', response); // Log the response

        // Kiểm tra nếu đăng ký thành công
        if (response?.err === 0) {
            dispatch({
                type: actionTypes.REGISTER_SUCCESS,
                data: response
            });
            return response;  // Trả về `response` từ đây nếu thành công
        } else {
            // Lỗi không xác định
            dispatch({
                type: actionTypes.REGISTER_FAIL,
                data: response.msg || 'Registration failed'
            });
        }
        return response;  // Trả về `response` từ đây nếu có lỗi
    }

    catch (error) {
        console.error('Register Action Error:', error); // Log detailed error
        dispatch({
            type: actionTypes.REGISTER_FAIL,
            data: 'An error occurred during registration'  // Xử lý lỗi khi có lỗi từ BE
        });
        throw error;  // Trả lỗi về nếu có lỗi xảy ra
    }
};

// Action for user login
export const login = (payload) => async (dispatch) => {
    try {
        const response = await apiLogin(payload);
        console.log('Login Response:', response); // Log the response

        // Kiểm tra nếu đăng nhập thành công
        if (response?.err === 0) {
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: { token: response.access_token, user: response.user },  // Truyền token và user
            });
            return response;  // Trả về response cho FE
        } else {
            dispatch({
                type: actionTypes.LOGIN_FAIL,
                data: response.msg || 'Login failed'
            });

            throw response;  // Ném ra lỗi từ server để xử lý ở chỗ gọi hàm
        }

    } catch (error) {
        console.error('Login Action Error:', error); // Log detailed error
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            data: error.msg,
        });
        throw error;  // Ném ra lỗi để xử lý ở frontend
    }
};

// Action for user logout
export const logout = () => ({
    type: actionTypes.LOGOUT
});
