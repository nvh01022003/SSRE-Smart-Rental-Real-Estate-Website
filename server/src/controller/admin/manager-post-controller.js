const managerPost = require('../../services/admin/manager-post')
// show all post in system
const showAllPost = async (req, res) => {
    try {
        const response = await managerPost.showAllPost()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showAllPost: ' + error
        })
    }
}
module.exports = {
    showAllPost
}
