const axios = require('axios');
const mysql = require('mysql2');

// Thông tin kết nối MySQL 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234567',
    database: 'bdssmart'
});

// API key của HERE
const apiKey = 'Tzhn4HlfTJCaXsiLyMmIPkHfXKpOupbvSJUjPpOzVvw';

// Thông tin người dùng nhập vào
const priceLimit = 1500000; // Giá tối đa người dùng mong muốn
const area = 'Thanh Khê'; // Khu vực người dùng mong muốn
const category = 'gym'; // Tiện ích người dùng muốn tìm kiếm (ví dụ: gym, chợ, ...)
const maxTravelDistance = 5000; // Khoảng cách đường đi tối đa (mét)

// Truy vấn MySQL để lấy các trọ phù hợp với yêu cầu của người dùng
const query = `SELECT id, latitude, longitude, name, address, price FROM realestate WHERE price <= ? AND address LIKE ?`;

// Hàm lấy dữ liệu từ MySQL
const fetchProperties = async () => {
    return new Promise((resolve, reject) => {
        connection.query(query, [priceLimit, `%${area}%`], (error, results) => {
            if (error) {
                reject(error);
            } else {
                console.log('Kết quả truy vấn MySQL:', results); // Log kết quả truy vấn MySQL
                resolve(results);
            }
        });
    });
};

// Hàm gọi API HERE Places
const fetchPlaces = async (coordinates) => {
    const placesUrl = `https://discover.search.hereapi.com/v1/discover?at=${coordinates}&q=${category}&limit=5&apiKey=${apiKey}`;
    console.log(`Gửi yêu cầu đến HERE Places API: ${placesUrl}`); // Log URL gửi tới API
    return axios.get(placesUrl);
};

// Hàm gọi API HERE Routing để tính đường đi
const fetchRoute = async (origin, destination) => {
    const routingUrl = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${origin}&destination=${destination}&return=summary&apiKey=${apiKey}`;
    console.log(`Gửi yêu cầu đến HERE Routing API: ${routingUrl}`); // Log URL gửi tới API
    return axios.get(routingUrl);
};

// Hàm xử lý mỗi trọ
const processProperty = async (property) => {
    const coordinates = `${property.latitude},${property.longitude}`;
    try {
        const placesResponse = await fetchPlaces(coordinates);
        console.log('Phản hồi từ HERE Places API:', placesResponse.data); // Log kết quả từ HERE Places API
        const places = placesResponse.data.items;

        // Tạo các promise để xử lý từng tiện ích
        const routePromises = places.map(async (place) => {
            const routingResponse = await fetchRoute(coordinates, `${place.position.lat},${place.position.lng}`);
            console.log('Phản hồi từ HERE Routing API:', routingResponse.data); // Log kết quả từ HERE Routing API
            const route = routingResponse.data.routes[0];
            const distance = route.sections[0].summary.distance;
            const travelTime = route.sections[0].summary.duration;

            // Kiểm tra xem khoảng cách có nằm trong giới hạn không
            if (distance <= maxTravelDistance) {
                return {
                    propertyId: property.id,
                    propertyName: property.name,
                    propertyAddress: property.address,
                    propertyPrice: property.price,
                    placeName: place.title,
                    placeAddress: place.address.label,
                    distance: distance,
                    travelTime: Math.round(travelTime / 60) // Chuyển giây sang phút
                };
            }
        });

        // Đợi tất cả các route hoàn thành
        const results = await Promise.all(routePromises);

        // Lọc các kết quả hợp lệ (không undefined)
        return results.filter(result => result !== undefined);
    } catch (error) {
        console.error(`Lỗi khi xử lý trọ ${property.name}:`, error);
        return [];
    }
};

// Hàm chính
const main = async () => {
    try {
        const properties = await fetchProperties();
        if (properties.length === 0) {
            console.log('Không tìm thấy trọ phù hợp.');
            return;
        }

        // Xử lý tất cả các trọ song song
        const results = await Promise.all(properties.map(processProperty));

        // Gộp mảng kết quả
        const finalResults = results.flat();

        // Hiển thị kết quả
        finalResults.forEach(result => {
            console.log(`Trọ: ${result.propertyName}, Địa chỉ: ${result.propertyAddress}, Giá: ${result.propertyPrice}`);
            console.log(`Tiện ích: ${result.placeName}, Địa chỉ: ${result.placeAddress}`);
            console.log(`Khoảng cách đường đi: ${result.distance} mét, Thời gian đi: ${result.travelTime} phút`);
            console.log('-----------------------');
        });
    } catch (error) {
        console.error('Lỗi trong quá trình xử lý:', error);
    } finally {
        connection.end();
    }
};

// Gọi hàm chính
main();
