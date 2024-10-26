const user = require("../../models/user");
const ladnlordServices = require("../../services/user-service/ladnlord-services")
const createPost = async (req, res) => {
    try {
        const imageUrls = req.body.imageUrls; // URL của các ảnh đã upload
        console.log('imageUrls', imageUrls)
        const contentPost = req.body.contentPost;
        const response = await ladnlordServices.createNewPost(req.user.id, contentPost, imageUrls);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
};

// UPDATE STATUS POST BY ID
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

// UPATE STATUS POSTS
const updateStatusPosts = async (req, res) => {
    try {
        const postIds = req.body.postIds;
        const status = req.body.status;
        const response = await ladnlordServices.updateStatusPosts(postIds, status);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

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
        console.log('postId', postId)
        const response = await ladnlordServices.deletePost(postId);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// DELETE LIST POST BY LIST ID POST
const deleteListPost = async (req, res) => {
    try {
        const postIds = req.body.postIds;
        const response = await ladnlordServices.deleteListPost(postIds);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
// LIST POST
const listPost = async (req, res) => {
    try {
        userId = req.user.id;
        const response = await ladnlordServices.listPost(userId);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
// SHOW LIST POST BY PAGE PAGINATION
const listPostByPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const userId = req.user.id
        const response = await ladnlordServices.listPostByPage(userId, page);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

module.exports = {
    createPost,
    updateStatusPost,
    updatePost,
    deletePost,
    deleteListPost,
    listPost,
    updateStatusPosts,
    listPostByPage

}
