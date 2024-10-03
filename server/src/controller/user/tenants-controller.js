const tenanstService = require("../../services/user-service/tenants-services")

const showInfoUser = async (req, res) => {
    const userId = req.user.id
    try {
        const response = await tenanstService.getInfoUser(userId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showInfoUser: ' + error
        })
    }
}

const changeInfo = async (req, res) => {
    const userId = req.user.id
    const userUpdate = req.body
    try {
        const response = await tenanstService.changeInfoUser(userId, userUpdate)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showInfoUser: ' + error
        })
    }
}
module.exports = { showInfoUser, changeInfo }