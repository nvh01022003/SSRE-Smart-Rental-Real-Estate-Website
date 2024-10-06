const axios = require('axios');

const address = "k311/29 Trường Chinh, phường An khê, quận Thanh Khê, Đà Nẵng";

axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`)
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
