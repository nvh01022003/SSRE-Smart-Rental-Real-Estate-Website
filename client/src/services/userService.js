import axios from 'axios';

export const getPersonalInfo = async (token) => {
    try {
        //const token = localStorage.getItem('token'); // Retrieve token from local storage
        const response = await axios.get('http://localhost:5000/api/v1/user/showInfo', {
            headers: {
                'token': ` ${token}` // Include token in headers
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching personal information:', error);
        throw error;
    }
};