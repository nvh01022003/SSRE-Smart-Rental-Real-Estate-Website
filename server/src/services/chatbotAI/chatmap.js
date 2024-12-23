const axios = require('axios');
require('dotenv').config();

const findNearbyLocations = async (lat, lon, radius, type) => {
    const apiKey = process.env.MAPKEY;
    const url = `https://maps.gomaps.pro/maps/api/place/nearbysearch/json`;

    try {
        const response = await axios.get(url, {
            params: {
                location: `${lat},${lon}`,
                radius: radius,
                keyword: type,
                language: "en",
                key: apiKey,
            },
        });

        // Xử lý kết quả trả về
        const locations = response.data.results.map((place) => ({
            name: place.name,
            lat: place.geometry.location.lat,
            lon: place.geometry.location.lng,
        }));
        // loại bỏ các kết quả trùng lặp
        const uniqueLocations = locations.filter((location, index, self) =>
            index === self.findIndex((t) => (
                t.name === location.name && t.lat === location.lat && t.lon === location.lon
            ))
        );
        return uniqueLocations;
    } catch (error) {
        console.error('Lỗi khi gọi API:', error.response?.data || error.message);
        return [];
    }
};

module.exports = { findNearbyLocations };
