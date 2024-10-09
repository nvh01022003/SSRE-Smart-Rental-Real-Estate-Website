const ladnlordServices = require("../../services/user-service/ladnlord-services")
const createPost = async (req, res) => {
    const userId = req.user.id
    // const { contentPost } = JSON.parse(req.body.contentPost)
    // const files = req.b
    console.log(req)
    // try {
    //     const response = await ladnlordServices.createNewPost(userId, contentPost, files)
    //     return res.status(200).json(response)
    // } catch (error) {
    //     return res.status(500).json({
    //         err: -1,
    //         msg: 'Fail at auth controller createPost: ' + error
    //     })
    // }
}
module.exports = { createPost }
