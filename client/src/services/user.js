import axios from 'axios';

export const apiGetCurrent = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/v1/user/showInfo');
        return response.data;

    } catch (error) {
        console.error('API GetCurrent Error:', error); // Ghi log lỗi chi tiết
    }
}