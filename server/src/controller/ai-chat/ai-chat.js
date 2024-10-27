const aichatService = require('../../services/ai-chatbot/ai-chat-services');
const { response } = require('express');

// Hàm xử lý yêu cầu từ AI Chatbot
const sendQuestion = async (req, res) => {
    try {
        const response = await aichatService.processMessage(req.body);
        res.json(response);
    } catch (error) {
        console.error('Lỗi khi xử lý yêu cầu từ AI Chatbot:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra' });
    }
};
module.exports = {
    sendQuestion
}