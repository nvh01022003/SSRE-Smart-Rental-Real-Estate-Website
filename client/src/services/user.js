import axios from 'axios';

export const apiGetCurrent = async (token) => {
    //const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:5000/api/v1/user/showInfo', {
            headers: {
                'token': `${token}` // Include token in headers
            }
        });
        return response.data;

    } catch (error) {
        console.error('API GetCurrent Error:', error); // Ghi log lỗi chi tiết
    }
}