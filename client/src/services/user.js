import axios from 'axios';

export const setUserInfo = async (token) => {

    try {
        const response = await axios.get('http://localhost:5000/api/v1/user/tenants/showInfo', {
            headers: {
                'token': `${token}` // Include token in headers
            }
        });
        return response.data;

    } catch (error) {
        console.error('API GetCurrent Error:', error); // Ghi log lỗi chi tiết
    }
}