const user = require("../../models/user");
const managerUser = require("../../services/admin/manager-user")


// show all user
const showAllUser = async (req, res) => {
    try {
        const response = await managerUser.showAllUser()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showAllUser: ' + error
        })
    }
}
// show detail user by id
const showDetailUser = async (req, res) => {
    const userId = req.params.userId
    try {
        const response = await managerUser.showDetailUser(userId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showDetailUser: ' + error
        })
    }
}
// update user by id
const updateUser = async (req, res) => {
    const userId = req.params.userId
    const data = req.body
    console.log('data', data)
    try {
        const response = await managerUser.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller updateUser: ' + error
        })
    }
}
// change role user từ user lên ladnlord 
const changeRoleUser = async (req, res) => {
    const userId = req.params.userId
    try {
        const response = await managerUser.changeRoleUser(userId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller changeRoleUser: ' + error
        })
    }
}
// từ chối yêu cầu nâng cấp tài khoản
const refuseChangeRoleUser = async (req, res) => {
    const userId = req.params.userId
    try {
        const response = await managerUser.changeRoleUser(userId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller changeRoleUser: ' + error
        })
    }
}
// delete user by id
const deleteUser = async (req, res) => {
    const userId = req.params.userId
    try {
        const response = await managerUser.deleteUser(userId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller deleteUser: ' + error
        })
    }
}
// delete user by select list id
const deleteUsers = async (req, res) => {
    const listId = req.body.listId
    try {
        const response = await managerUser.deleteUsers(listId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller deleteUsers: ' + error
        })
    }
}
// find user by email
const findUserByEmail = async (req, res) => {
    const email = req.body.email
    try {
        const response = await managerUser.findUserByEmail(email)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller findUserByEmail: ' + error
        })
    }
}
// find user by role
const findUserByRole = async (req, res) => {
    const role = req.body.role
    try {
        const response = await managerUser.findUserByRole(role)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller findUserByRole: ' + error
        })
    }
}
// show all upgrade request
const showAllUpgradeRequest = async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const response = await managerUser.showAllUpgradeRequest(page)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showAllUpgradeRequest: ' + error
        })
    }
}


module.exports = {
    showAllUser,
    showDetailUser,
    updateUser,
    changeRoleUser,
    deleteUser,
    deleteUsers,
    findUserByEmail,
    findUserByRole,
    showAllUpgradeRequest,
    refuseChangeRoleUser

}
