const rateLimit = require('express-rate-limit');

const antiSpam = rateLimit({
    windowMs: 0.5 * 60 * 1000, // 1 phút
    max: 3, // Giới hạn 100 request mỗi IP
    handler: (req, res) => {
        res.status(429).json({
            err: -1,
            msg: `Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ${Math.ceil(0.5 * 60)} giây.`
        });
    }
});

module.exports = {
    antiSpam
};
