const axios = require("axios");
require("dotenv").config(); // Tải biến môi trường từ file .env

async function getGeminiResponse(address) {
    try {
        // URL của endpoint Gemini
        const endpoint = "https://api.googleai.com/v1/models/gemini-1.5/chat";

        // Cấu hình yêu cầu, bao gồm headers và nội dung
        const response = await axios.post(
            endpoint,
            {
                messages: [
                    {
                        role: "user",
                        content: `
              Địa chỉ: ${address}
              Hãy cung cấp các thông tin sau về khu vực này:
              - Vị trí thuận lợi gì?
              - An ninh khu vực thế nào?
              - Tình hình giao thông?
              - Các tiện ích xung quanh?
              - Tiềm năng tăng giá?
            `,
                    },
                ],
                model: "gemini-1.5-pro",
                max_tokens: 800, // giới hạn token phản hồi
            },
            {
                headers: {
                    "Authorization": `AIzaSyBhrLKzKGBXZw21kPdBxdc-lbXFCD7_mQE`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Hiển thị kết quả phản hồi
        console.log("Kết quả:", response.data.choices[0].message.content);
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error.response ? error.response.data : error.message);
    }
}

// Gọi hàm với địa chỉ cụ thể
getGeminiResponse("123 Đường ABC, Quận 1, Thành phố Hồ Chí Minh");
