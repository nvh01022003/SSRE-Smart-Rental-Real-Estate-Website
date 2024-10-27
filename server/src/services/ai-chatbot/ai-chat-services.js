const { Post, Coordinates, Overview, sequelize } = require('../../models');
const { where } = require("sequelize");
const { Op } = require('sequelize');
const { Wit } = require('node-wit');
const apiKey = 'Tzhn4HlfTJCaXsiLyMmIPkHfXKpOupbvSJUjPpOzVvw';
const client = new Wit({ accessToken: 'OJIF545L65D7BHRXSMC6P52Q373GT4HL' });

// dựa vào file aichat.js để xây dựng các hàm xử lý yêu cầu từ AI Chatbot
const processMessage = async (req) => {
    const { message } = req;
    console.log('message', message);
    try {
        const response = await client.message(message, {}); // Sử dụng mess là câu nhập
        console.log('Entities:', response.entities); // In ra các thực thể (entities) đã phân tích được
    } catch (error) {
        console.error('Lỗi phân tích:', error);
    }


};
module.exports = {
    processMessage
}
// OJIF545L65D7BHRXSMC6P52Q373GT4HL