// import axios from 'axios';

// export const apiGetCurrent = async () => {
//     //const token = localStorage.getItem('token');
//     const persistAuth = localStorage.getItem('persist:auth');
//     const authData = JSON.parse(persistAuth);
//     const token = authData.token.replace(/"/g, ''); // Remove quotes from token
//     try {
//         const response = await axios.get('http://localhost:5000/api/v1/user/showInfo', {
//             headers: {
//                 'token': `${token}` // Include token in headers
//             }
//         });
//         return response.data;

//     } catch (error) {
//         console.error('API GetCurrent Error:', error); // Ghi log lỗi chi tiết
//     }
// }