const { Post } = require('../../models/index');
// show all post in system
const showAllPost = async () => {
    const post = await Post.findAll()
    return post
}
// delete post by select list id ( sử dụng cho phần chọn nhiều id sau đó xóa)
const deletePosts = async (listId) => {
    const post = await Post.destroy({
        where: {
            id: listId
        }
    })
    return post
}
// show detail post by id
const showDetailPost = async (postId) => {
    const post = await Post.findOne({
        where: {
            id: postId
        }
    })
    return post
}
// delete post by id
const deletePost = async (postId) => {
    const post = await Post.destroy({
        where: {
            id: postId
        }
    })
    return post
}
module.exports = {
    showAllPost,
    deletePosts,
    showDetailPost,
    deletePost
}