const { User, Post, Address, Image, Category, Overview, Coordinates, PostType, sequelize } = require("../../models/index");
// show all post in system
const showAllPost = async () => {
    try {
        const post = await Post.findAll({
            order: [['createdAt', 'DESC']],
            // trả về đủ thông tin của post
            include: [
                {
                    model: Address,
                    attributes: ['city', 'district', 'detail_address']
                },
                {
                    model: Image,
                    attributes: ['img_url_list']
                },
                {
                    model: Category,
                    attributes: ['id', 'category_name']
                },
                {
                    model: User,
                    attributes: ['firstName', 'lastName', 'email', 'phone', 'img_avt']
                },
                {
                    model: Overview,
                    attributes: ['target', 'expire']
                },

            ]
        })
        return {
            err: 0,
            posts: post
        };
    }
    catch (err) {
        return {
            err: 1,
            posts: [],
            msg: err
        };
    }
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
    try {
        const post = await Post.destroy({
            where: {
                id: postId
            }
        })
        return {
            err: 0,
            posts: post
        };
    }
    catch (err) {
        return {
            err: 1,
            posts: [],
            msg: err
        };
    }
}
// tạo loại bài đăng
const createTypePost = async (name, price) => {
    try {
        const postType = await PostType.create({
            name: name,
            price: price
        })
        return {
            err: 0,
            postType: postType
        };
    }
    catch (err) {
        return {
            err: 1,
            postType: [],
            msg: err
        };
    }
}
// update loại bài đăng
const updateTypePost = async (typePostId, name, price) => {
    try {
        const postType = await PostType.update({
            name: name,
            price: price
        }, {
            where: {
                id: typePostId
            }
        })
        return {
            err: 0,
            postType: postType
        };
    }
    catch (err) {
        return {
            err: 1,
            postType: [],
            msg: err
        };
    }
}
// delete loại bài đăng
const deleteTypePost = async (typePostId) => {
    try {
        const postType = await PostType.destroy({
            where: {
                id: typePostId
            }
        })
        return {
            err: 0,
            postType: postType
        };
    }
    catch (err) {
        return {
            err: 1,
            postType: [],
            msg: err
        };
    }
}
// show all loại bài đăng có phân trang
const showAllTypePost = async () => {
    try {
        const postType = await PostType.findAll()
        return {
            err: 0,
            postType: postType
        };
    }
    catch (err) {
        return {
            err: 1,
            postType: [],
            msg: err
        };
    }
}
module.exports = {
    showAllPost,
    deletePosts,
    showDetailPost,
    deletePost,
    createTypePost,
    updateTypePost,
    deleteTypePost,
    showAllTypePost
}