const { GoogleGenerativeAI } = require("@google/generative-ai");

const googleApiKey = 'AIzaSyBhrLKzKGBXZw21kPdBxdc-lbXFCD7_mQE';

const genAI = new GoogleGenerativeAI(googleApiKey);

async function getGoogleResponse(message) {
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
async function processQuery(question) {
    try {
        const response = await getGoogleResponse(question);
        console.log('AI-SRRE Response:', response);
    } catch (error) {
        console.error('Có lỗi xảy ra khi gọi API:', error);
    }
}

// Ví dụ sử dụng:
processQuery('khu vực Hải Châu II, Hải Châu, Đà Nẵng. Tìm giúp tôi một số tiện ích gồm: bệnh viện, trường học, an ninh khu vực. Trả kết quả dưới dạng một mô tả về thông tin bệnh viện, trường học, an ninh xung quanh trong khu vực.')
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
    });
