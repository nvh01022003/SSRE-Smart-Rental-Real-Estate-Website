const registerService = require("../services/auth")
const resgister = async (req, res) => {
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
const login = async (req, res) => {
    let { email, password } = req.body
    const response = await registerService.loginService({ email, password })
    if (response.err == 0) {
        res.status(200).send(response.msg)
    }
    else {
        res.status(400).send(response.msg)
    }


}
module.exports = { resgister, login }