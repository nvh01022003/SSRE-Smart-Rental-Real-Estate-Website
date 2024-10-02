const registerService = require("../services/auth")


const register = async (req, res) => {
    // let { firstName, lastName, numberPhone, email, password } = req.body
    try {
        const response = await registerService.registerService(req.body)
        console.log(response)
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
module.exports = { register, login }