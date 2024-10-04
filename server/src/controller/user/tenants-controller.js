const { report } = require("../../routes/auth")
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
    console.log(userUpdate)
    try {
        const response = await tenanstService.changeInfoUser(userId, userUpdate)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller changeInfo: ' + error
        })
    }
}

const savaPost = async (req, res) => {
    const userId = req.user.id
    const postId = req.params.id
    try {
        const response = await tenanstService.savePost(userId, postId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller savaPost: ' + error
        })
    }
}

const reportPost = async (req, res) => {
    const userId = req.user.id
    const postId = req.params.id
    const desc = req.body.desc
    try {
        const response = await tenanstService.reportPost(userId, postId, desc)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller reportPost: ' + error
        })
    }
}
module.exports = { showInfoUser, changeInfo, savaPost, reportPost }