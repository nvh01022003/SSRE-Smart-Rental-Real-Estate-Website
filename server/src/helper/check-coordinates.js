
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const getGeocodingData = async (address) => {
    const apiKey = process.env.MAPKEY;
    const url = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const result = response.data.results[0];
            const { lat, lng } = result.geometry.location;
            console.log('lat:', lat, 'lng:', lng);
            return {
                err: 0,
                lat,
                lng
            };
        } else {
            return {
                err: 1,
                message: 'Not found location.'
            };
        }
    } catch (error) {
        return {
            err: 2,
            message: 'Error fetching geocoding data.'
        };
    }
}
module.exports = { getGeocodingData };
