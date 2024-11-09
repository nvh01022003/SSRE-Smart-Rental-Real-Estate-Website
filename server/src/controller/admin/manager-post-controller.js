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
// show all soft Delete Posts
const showAllSoftDeletePosts = async (req, res) => {
    try {
        const response = await managerPost.showAllSoftDeletePosts()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showAllPost: ' + error
        })
    }
}
// khôi phục post đã xóa mềm
const restorePost = async (req, res) => {
    const postId = req.params.postId
    try {
        const response = await managerPost.restorePost(postId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller restorePost: ' + error
        })
    }
}
/// Soft delete posts by selecting a list of ids (chuyển trạng thái thành 1)
const softDeletePosts = async (req, res) => {
    const listId = req.body.listId;
    try {
        const response = await managerPost.softDeletePosts(listId); // Gọi hàm xóa mềm
        return res.status(200).json({
            message: 'Posts successfully soft deleted',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller softDeletePosts: ' + error
        });
    }
}

// Soft delete post by id (chuyển trạng thái thành 1)
const softDeletePost = async (req, res) => {
    const postId = req.params.postId;
    try {
        const response = await managerPost.softDeletePost(postId); // Gọi hàm xóa mềm
        return res.status(200).json({
            message: 'Post successfully soft deleted',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller softDeletePost: ' + error
        });
    }
}

// delete post by select list id ( sử dụng cho phần chọn nhiều id sau đó xóa)
const deletePosts = async (req, res) => {
    const listId = req.body.listId
    try {
        const response = await managerPost.deletePosts(listId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller deletePosts: ' + error
        })
    }
}
// show detail post by id
const showDetailPost = async (req, res) => {
    const postId = req.params.postId
    try {
        const response = await managerPost.showDetailPost(postId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showDetailPost: ' + error
        })
    }
}
// delete post by id
const deletePost = async (req, res) => {
    const postId = req.params.postId
    try {
        const response = await managerPost.deletePost(postId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller deletePost: ' + error
        })
    }
}
module.exports = {
    showAllPost,
    deletePosts,
    showDetailPost,
    deletePost,
    softDeletePosts,
    softDeletePost,
    showAllSoftDeletePosts,
    restorePost
}
