const bcryptjs = require("bcryptjs");
const gravatar = require("gravatar");
const { where } = require("sequelize");
const helper = require("../../helper/check-coordinates");
const { Post, Address, Category, Image, Overview, Coordinates, sequelize } = require("../../models/index");
const middleware = require("../../middleware/upload/uploadImg")
const { response } = require("express");
// TAO CODE NGAU NHIEN THEO TIME
const generateRandomCode = () => {
    const timestamp = Date.now().toString();
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${timestamp}${randomStr}`.substring(0, 6);
};

// CREATE POST
const createNewPost = async (userId, contentPost, files) => {
    contentPost = JSON.parse(contentPost)  //ép kiểu qua kiểu json vì bên client gửi lên dạng string
    const imageUrls = files;
    const { title, address, price, description, overview, category_id, acreage } = contentPost
    const addressData = address
    const overviewData = {
        ...overview,
        code: generateRandomCode(),
        area: address.city,
        type: category_id
    }
    let addressStr = addressData.detail_address + ", " + addressData.district + ", " + addressData.city
    const resCoordinates = await helper.getGeocodingData(addressStr)
    const coordinatesData = {
        lat: resCoordinates.lat,
        lon: resCoordinates.lng
    }

    try {
        const [resAddress, resOverview, resCoordinates, resImage] = await Promise.all([
            Address.create(addressData),
            Overview.create(overviewData),
            Coordinates.create(coordinatesData),
            Image.create({ img_url_list: JSON.stringify(imageUrls) })
        ]);
        const resPost = await Post.create({
            title,
            price,
            description,
            user_id: userId,
            address_id: resAddress.id,
            overview_id: resOverview.id,
            coordinates_id: resCoordinates.id,
            category_id: category_id,
            acreage: acreage,
            img_id: resImage.id
        });
        return {
            err: 0,
            msg: 'Create post success',
            post: resPost
        }
    } catch (error) {
        console.log(error)
        return {
            err: 1,
            msg: error
        }
    }
}
// UPDATE STATUS POST
const updateStatusPost = async (postId, status) => {
    try {
        const resPost = await Post.update({ status }, {
            where: {
                id: postId
            }
        })
        return {
            err: 0,
            msg: 'Update status post success',
            post: resPost
        }
    } catch (error) {
        console.log(error)
        return {
            err: 1,
            msg: error
        }
    }
}
// UPDATE STATUS POSTS
const updateStatusPosts = async (postIds, status) => {
    try {
        const resPost = await Post.update({ status }, {
            where: {
                id: postIds
            }
        })
        return {
            err: 0,
            msg: 'Update status posts success',
            post: resPost
        }
    } catch (error) {
        console.log(error)
        return {
            err: 1,
            msg: error
        }
    }
}
// UPDATE POST
const updatePost = async (postId, dataUpdae) => {
    try {
        const resPost = await Post.update(dataUpdae, {
            where: {
                id: postId
            }
        })
        return {
            err: 0,
            msg: 'Update post success',
            post: resPost
        }
    } catch (error) {
        console.log(error)
        return {
            err: 1,
            msg: error
        }
    }
}
// DELETE POST
const deletePost = async (postId) => {
    try {
        const resPost = await Post.destroy({
            where: {
                id: postId
            }
        })
        return {
            err: 0,
            msg: 'Delete post success',
            post: resPost
        }
    } catch (error) {
        console.log(error)
        return {
            err: 1,
            msg: error
        }
    }
}
// DELETE LIST POST BY LIST ID POST
const deleteListPost = async (postIds) => {
    try {
        const resPost = await Post.destroy({
            where: {
                id: postIds
            }
        })
        return {
            err: 0,
            msg: 'Delete list post success',
            post: resPost
        }
    } catch (error) {
        console.log(error)
        return {
            err: 1,
            msg: error
        }
    }
}
// LIST POST
const listPost = async (userId) => {
    try {
        const resPost = await Post.findAll({
            where: {
                user_id: userId
            }
        })
        return {
            err: 0,
            msg: resPost
        }
    } catch (error) {
        console.log(error)
        return {
            err: 1,
            msg: error
        }
    }
}
// LIST POST BY PAGE PAGINATION
const listPostByPageAtHome = async (page, limit) => {
    try {
        const resPost = await Post.findAll({
            where: {
                user_id: userId
            },
            limit: limit,
            offset: (page - 1) * limit
        })
        return {
            err: 0,
            msg: resPost
        }
    } catch (error) {
        console.log(error)
        return {
            err: 1,
            msg: error
        }
    }
}
module.exports = {
    createNewPost,
    updateStatusPost,
    updatePost,
    deletePost,
    deleteListPost,
    listPost,
    updateStatusPosts,
    listPostByPageAtHome
};
