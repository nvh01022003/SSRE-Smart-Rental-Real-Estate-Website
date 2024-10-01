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

export const apiRegister = (payload) => new Promise(async (resolve, reject) => {
    console.log('Payload:', payload); // Kiểm tra dữ liệu trước khi gửi
    try {
        const response = await axiosConfig({
            method: 'post',
            url: 'http://localhost:5000/api/v1/auth/register',
            data: payload
        });
        console.log('API Register Response:', response); // Log the response
        resolve(response.data); // Trả về dữ liệu từ response.data

    } catch (error) {
        console.error('API Register Error:', error); // Ghi log lỗi chi tiết
        reject(error.response ? error.response.data : 'Something went wrong');
    }
});

export const apiLogin = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: 'http://localhost:5000/api/v1/auth/login',
            data: payload
        });
        console.log('API Login Response:', response); // Log the response
        resolve(response.data); // Trả về dữ liệu từ response.data

    } catch (error) {
        console.error('API Login Error:', error); // Ghi log lỗi chi tiết
        reject(error.response ? error.response.data : 'Something went wrong');
    }
});
