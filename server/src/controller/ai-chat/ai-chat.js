const aichatService = require('../../services/ai-chatbot/aichat');
const { response } = require('express');

// Hàm xử lý yêu cầu từ AI Chatbot
const sendQuestion = async (req, res) => {
    try {
        const response = await aichatService.processQuery(req.body);
        res.json(response);
    } catch (error) {
        console.error('Lỗi khi xử lý yêu cầu từ AI Chatbot:', error);
        res.status(500).json({ message: 'Yêu cầu hiện chưa được xử lý, hãy thử gửi lại' });
    }
};
module.exports = {
    sendQuestion
}