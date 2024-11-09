const { Post } = require('../../models/index');
// show all post in system
const showAllPost = async () => {
    const post = await Post.findAll({
        where: {
            status: 0 // kiểm tra xem post có bị xóa mềm không
        }
    });
    return post;
}
const showAllSoftDeletePosts = async () => {
    const post = await Post.findAll({
        where: {
            status: 1 // kiểm tra xem post có bị xóa mềm không
        }
    });
    return post;
}
// khôi phục post đã xóa mềm
const restorePost = async (postId) => {
    const post = await Post.update(
        { status: 0 }, // Khôi phục lại trạng thái thành 0
        {
            where: {
                id: postId,
                status: 1 // khôi phục bài viết có status = 1 (đã bị xóa mềm)
            }
        }
    );
    return post;
}
//delete mềm :3 post by select list id ( sử dụng cho phần chọn nhiều id sau đó xóa)
const softDeletePosts = async (listId) => {
    const post = await Post.update(
        { status: 1 }, // Cập nhật status thành 1
        {
            where: {
                id: listId
            }
        }
    );
    return post;
}
//delele mềm post by id 
const softDeletePost = async (postId) => {
    const post = await Post.update(
        { status: 1 }, // Cập nhật status thành 1
        {
            where: {
                id: postId
            }
        }
    );
    return post;
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
    deletePost,
    softDeletePosts,
    softDeletePost,
    showAllSoftDeletePosts,
    restorePost
}