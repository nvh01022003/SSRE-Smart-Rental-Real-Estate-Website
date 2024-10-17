const ladnlordServices = require("../../services/user-service/ladnlord-services")
const createPost = async (req, res) => {
    try {
        const imageUrls = req.body.imageUrls; // URL của các ảnh đã upload
        const contentPost = req.body.contentPost;
        const response = await ladnlordServices.createNewPost(req.user.id, contentPost, imageUrls);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
};
const updateStatusPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const status = req.body.status;
        const response = await ladnlordServices.updateStatusPost(postId, status);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
};
// UPATE POST
const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const dataUpdae = req.body;
        const response = await ladnlordServices.updatePost(postId, dataUpdae);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
// DELETE POST
const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const response = await ladnlordServices.deletePost(postId);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
module.exports = {
    createPost,
    updateStatusPost,
    updatePost,
    deletePost
}
