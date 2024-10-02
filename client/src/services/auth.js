// import axiosConfig from '../axiosConfig'

// export const apiRegister = (payload) => new Promise(async (resolve, reject) => {
//     console.log(payload)
//     try {
//         const response = await axiosConfig({
//             method: 'post',
//             url: '/api/v1/auth/register',
//             data: payload
//         })
//         resolve(response)

//     } catch (error) {
//         reject(error)
//     }
// })
// export const apiLogin = (payload) => new Promise(async (resolve, reject) => {
//     try {
//         const response = await axiosConfig({
//             method: 'post',
//             url: '/api/v1/auth/login',
//             data: payload
//         })
//         resolve(response)

//     } catch (error) {
//         reject(error)
//     }
// })



import axiosConfig from '../axiosConfig'
import axios from 'axios';

export const apiRegister = async (payload) => {
    console.log('Payload:', payload); // Kiểm tra dữ liệu trước khi gửi
    try {
        // const response = await axiosConfig({
        //     method: 'post',
        //     url: 'http://localhost:5000/api/v1/auth/validatemail',
        //     data: payload
        // });
        const response = await axios.post('http://localhost:5000/api/v1/auth/validatemail', payload);
        console.log('API Register Response:', response); // Log the response
        return response.data;

    } catch (error) {
        console.error('API Register Error:', error); // Ghi log lỗi chi tiết
        throw error.response ? error.response.data : 'Something went wrong';
    }
};

export const apiLogin = async (payload) => {
    try {
        const response = await axiosConfig.post('http://localhost:5000/api/v1/auth/login', payload);
        console.log('API Login Response:', response);
        return response.data;  // Trả về response.data cho frontend
    } catch (error) {
        // Kiểm tra nếu có lỗi từ phản hồi của server (400, 500, ...)
        if (error.response) {
            console.error('API Login Error Response:', error.response.data);  // In ra lỗi từ server
            throw error.response.data;  // Ném ra lỗi từ server để xử lý ở chỗ gọi hàm
        } else {
            // Nếu không có phản hồi từ server, ném ra lỗi mặc định
            throw new Error('Something went wrong');
        }
    }
};
