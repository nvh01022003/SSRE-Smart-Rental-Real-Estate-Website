const registerService = require("../services/auth")
//RESGISTER
const insert = async (req, res) => {
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
module.exports = { insert }