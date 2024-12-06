const axios = require('axios');
require('dotenv').config();

const findNearbyLocations = async (lat, lon, radius, type) => {
    const apiKey = process.env.MAPKEY; // Lấy API Key từ file .env
    const url = `https://maps.gomaps.pro/maps/api/place/nearbysearch/json`;

    try {
        const response = await axios.get(url, {
            params: {
                location: `${lat},${lon}`, // Tọa độ vĩ độ, kinh độ
                radius: radius, // Bán kính tìm kiếm
                type: type, // Loại địa điểm
                language: "en", // Ngôn ngữ (nếu cần)
                key: apiKey, // API Key
            },
        });

        // Xử lý kết quả trả về
        const locations = response.data.results.map((place) => ({
            name: place.name,
            lat: place.geometry.location.lat,
            lon: place.geometry.location.lng,
        }));

        return locations;
    } catch (error) {
        console.error('Lỗi khi gọi API:', error.response?.data || error.message);
        return [];
    }
};

module.exports = { findNearbyLocations };
