const axios = require('axios');

async function getGeocodingData(address) {
    const apiKey = 'AlzaSytO_M2Z8bkR6JgRI1m8_Qvcfn0D_t0kvqu';  // Thay bằng API key của bạn
    const url = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);

        // Kiểm tra nếu có kết quả hợp lệ
        if (response.data.status === 'OK') {
            // Lấy kết quả đầu tiên từ danh sách kết quả
            const result = response.data.results[0];

            // Lấy tọa độ vĩ độ và kinh độ từ đối tượng geometry.location
            const { lat, lng } = result.geometry.location;

            console.log(`Địa chỉ: ${result.formatted_address}`);
            console.log(`Vĩ độ (Latitude): ${lat}`);
            console.log(`Kinh độ (Longitude): ${lng}`);
        } else {
            console.log('Không tìm thấy kết quả cho địa chỉ này.');
        }
    } catch (error) {
        console.error('Error fetching geocoding data:', error);
    }
}

// Gọi hàm với địa chỉ bạn muốn
getGeocodingData('K311/29 Trường Chinh, thành phố Đà Nẵng, Việt Nam');
