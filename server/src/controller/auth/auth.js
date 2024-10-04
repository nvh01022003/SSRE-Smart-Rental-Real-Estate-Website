
const registerService = require("../../services/auth/auth")
const jwt = require("jsonwebtoken");

//RESGISTER
const register = async (req, res) => {
    // let { firstName, lastName, numberPhone, email, password } = req.body
    try {
        const response = await registerService.registerService(req.body)

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller: ' + error
        })
    }
}
// LOGIN
const login = async (req, res) => {
    let { email, password } = req.body


    try {
        const response = await registerService.loginService({ email, password })

        if (response.err === 0) {
            // Trả về thành công
            return res.status(200).json(response);
        } else {
            // Trả về lỗi khi không tìm thấy email
            return res.status(400).json(response);  // Sử dụng status 400 cho lỗi "Email does not exist"
        }
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller: ' + error
        });
    }
}

const authenticateToken = (req, res, next) => {
    // Lấy token từ header
    const token = req.headers["token"];

    if (!token) {
        return res.status(401).json({ err: 1, msg: 'Token not exits' });
    }

    // Giải mã và xác thực token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ err: 1, msg: 'Token not valid' });
        }
        req.user = user; // Thêm thông tin người dùng vào request
        next();
    });
};

module.exports = { register, login, authenticateToken }

