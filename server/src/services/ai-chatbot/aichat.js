const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const googleApiKey = process.env.GOOGLE_API_KEY;

const genAI = new GoogleGenerativeAI(googleApiKey);

const getGoogleResponse = async (message) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
        generationConfig
    });

    const result = await chatSession.sendMessage(message);
    return result.response.text();
}

// Hàm này sẽ nhận câu hỏi và trả về kết quả từ AI
const processQuery = async (question) => {
    const { message } = question;
    // kiểm tra xem có câu hỏi không
    if (message.includes('bạn là ai') || message.includes('bạn tên gì') || message.includes('bạn là gì') || message.includes('ai tạo ra bạn') || message.includes('ai làm ra bạn') || message.includes('bạn do ai tạo ra') || message.includes('ai làm ra')) {
        return { message: "Tôi là trợ lý ảo của dự án SRRE, tạo ra bởi TriTechz" };
    }
    if (message.includes('tạm biệt') || message.includes('hẹn gặp lại')) {
        return { message: "Hẹn gặp lại bạn sau!" };
    }
    if (message.includes('cảm ơn') || message.includes('thanks') || message.includes('thank you')) {
        return { message: "Không có gì, hãy hỏi thêm nếu cần!" };

    }
    //    giới thiệu dự án
    if (message.includes('dự án này là gì') || message.includes('srre') || message.includes(' giới thiệu về website')) {
        return { message: "Dự án SRRE là dự án về bất động sản bền vững, giúp người dùng tìm kiếm thông tin về bất động sản, đánh giá môi trường sống, và nhiều tính năng khác" };
    }
    if (message.includes('quy trình làm việc của srre')) {
        return { message: "Quy trình làm việc của SRRE bao gồm: Thu thập dữ liệu, Xử lý dữ liệu, Hiển thị dữ liệu, và Phản hồi người dùng" };
    }
    if (message.includes('đăng bài') || message.includes('đăng tin') || message.includes('đăng bài viết') || message.includes('đăng tin tức') || message.includes('đăng tin tức mới')) {
        //    gọi api show giá bài viết
        return { message: "đợi làm thêm" };

    }
    else {
        try {
            const response = await getGoogleResponse(message);
            return { message: response };
        } catch (error) {
            console.error('Có lỗi xảy ra khi gọi API:', error);
        }
    }
}

module.exports = {
    processQuery
}