const findData = require("./find-data-question");
const scanMap = require('./chatmap');
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
        generationConfig,
    });

    const result = await chatSession.sendMessage(message);
    return result.response.text();
};

const processQuery = async (message) => {
    // console.log(message);
    if (
        message.includes("bạn là ai") ||
        message.includes("bạn tên gì") ||
        message.includes("bạn là gì") ||
        message.includes("ai tạo ra bạn") ||
        message.includes("ai làm ra bạn") ||
        message.includes("bạn do ai tạo ra")
    ) {
        return { message: "Tôi là trợ lý ảo của dự án SRRE, tạo ra bởi TriTechz" };
    }
    if (message.includes("tạm biệt") || message.includes("hẹn gặp lại")) {
        return { message: "Hẹn gặp lại bạn sau!" };
    }
    if (message.includes("cảm ơn") || message.includes("thanks") || message.includes("thank you")) {
        return { message: "Không có gì, hãy hỏi thêm nếu cần!" };
    }
    if (
        message.includes("dự án này là gì") ||
        message.includes("srre") ||
        message.includes("giới thiệu về website")
    ) {
        return {
            message:
                "Dự án SRRE là dự án về bất động sản bền vững, giúp người dùng tìm kiếm thông tin về bất động sản, đánh giá môi trường sống, và nhiều tính năng khác",
        };
    }
    if (message.includes("quy trình làm việc của srre")) {
        return {
            message:
                "Quy trình làm việc của SRRE bao gồm: Thu thập dữ liệu, Xử lý dữ liệu, Hiển thị dữ liệu, và Phản hồi người dùng",
        };
    }
    if (
        message.includes("đăng bài") ||
        message.includes("đăng tin") ||
        message.includes("đăng bài viết") ||
        message.includes("đăng tin tức") ||
        message.includes("đăng tin tức mới")
    ) {
        return { message: "Chức năng đăng bài hiện chưa hoàn thiện." };
    }

    // Gửi câu hỏi tới Gemini để phân loại
    try {
        const response = await getGoogleResponse(
            `
            Phân tích câu hỏi sau: "${message}" 

            1. Nếu câu hỏi liên quan đến tiện ích xung quanh một địa chỉ cụ thể, ví dụ: quán cà phê, bệnh viện, trường học trong bán kính cụ thể, hãy trả dạng:
            {
                "case": 1,
                "category": "trọ hoặc nhà, chung cư.. trong question",
                "city": "Tên thành phố trong câu hỏi",
                "district": "Tên quận dưới cấp thành phố trong câu hỏi", không hiển thị thêm các cấp khác như phường, xã
                "objectFind": "Đối tượng cần tìm theo khoảnh cách trong câu hỏi (ví dụ: quán cà phê, phòng gym, bệnh viện), ví dụ tôi muốn tìm trọ cách sân bay 2km thì sân bay là từ khóa, yêu cầu chuyển sang tiếng anh, nếu có nhiều dữ liệu hãy lấy keyword chính và sử dụng dấu phẩy để phân cách",
                "distance": "Khoảng cách được đề cập trong câu hỏi (ví dụ: 5km), hãy chuyển tất cả các đơn vị về mét và không ghi đơn vị, ví dụ 1km sẽ cho input là 1000"
            }
             - ngược lại không đủ các điều kiện đầu vào như: city, district, objectFind, distance cho trường hợp 1 hoặc quá nhiều dữ liệu, thì trả về:{
                "case": 1,
                "response": "Câu hỏi không đủ điều kiện hoặc hãy đưa ra một câu hỏi xúc tích hơn"
                }

            2. Nếu câu hỏi liên quan đến an ninh trật tự hoặc giao thông, môi trường sống tại một địa chỉ cụ thể, hãy trả lời ngắn ngọn theo  các ý ví dụ:
           {
                "case": 2,
                "response": "
                 Giao thông: "Giao thông tại địa chỉ A đang kẹt, cần tránh xa khu vực này."
                 An ninh trật tự: "Khu vực B có mức độ an ninh tốt, không có vấn đề về an ninh"
                 Môi trường sống: "Môi trường sống tại C rất tốt, không khí trong lành, không ồn ào."
                 "
                 Nếu mục tìm kiếm nào không có trong câu hỏi thì không hiển thị mục đó trong response
                 }


            3. Nếu câu hỏi không liên quan đến các trường hợp trên hãy trả câu trả lời ngắn gọn theo dạng:
            {
                "case": 3,
                "response": "Nội dung này chưa được hỗ trợ, vui lòng thử lại với câu hỏi khác, hoặc đưa ra câu hỏi cụ thể hơn"
            }
            Chỉ trả về nội dung JSON như trong {}. Không thêm bất kỳ giải thích, ký tự thừa hoặc định dạng khác không nằm trong {} thì bỏ qua.
           
        ` );
        // console.log(response);
        // chỉ nội dung con trong {} của response
        let jsonContent = response.match(/\{([^}]*)\}/)[0];
        // ép kiểu JSON
        jsonContent = JSON.parse(jsonContent);
        console.log(jsonContent);
        // tìm dữ liệu theo câu hỏi và trả về
        if (jsonContent.case === 1) {
            const { city, district, objectFind, distance, category } = jsonContent;
            const data = await findData.findByQueston(city, district, objectFind, distance, category);
            await Promise.all(data.map(async (element) => {
                try {
                    const result = await scanMap.findNearbyLocations(element.lat, element.lon, distance, objectFind);
                    element.resultFind = result;
                    element.amountFind = result.length;
                } catch (error) {
                    console.error('Lỗi khi tìm kiếm dữ liệu từ Overpass API:', error);
                }
            }));
            // sort theo giảm dần amountFind 
            data.sort((a, b) => b.amountFind - a.amountFind);
            console.log(data[0]);
            return data[0];

        } else if (jsonContent.case === 2) {
            // xử lý sau nếu có idea
            return jsonContent;
        } else if (jsonContent.case === 3) {
            return jsonContent;
        } else {
            return { res: 3, message: "Không thể phân loại câu hỏi." };
        }
    } catch (error) {
        console.error("Lỗi khi gọi Gemini:", error.message);
        return { res: 3, message: "Không thể phân loại câu hỏi." };
    }
};

module.exports = {
    processQuery,
};
