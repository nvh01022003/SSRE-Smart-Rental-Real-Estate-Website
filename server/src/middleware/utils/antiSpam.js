const rateLimit = require('express-rate-limit');

const antiSpam = rateLimit({
    windowMs: 0.5 * 60 * 1000, // 1 phút
    max: 3, // Giới hạn 100 request mỗi IP
    message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.'
});

module.exports = {
    antiSpam
};
