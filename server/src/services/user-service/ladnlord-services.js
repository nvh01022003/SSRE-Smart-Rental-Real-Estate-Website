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
    contentPost = JSON.parse(contentPost)
    const imageUrls = files;
    console.log(imageUrls)
    const { title, address, price, description, overview, category_id } = contentPost
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
        // diachi
        const resAddress = await Address.create(addressData)
        // bang overview
        const resOverview = await Overview.create(overviewData)
        // bang toa do
        const resCoordinates = await Coordinates.create(coordinatesData)
        // bang img cua baiviet
        const resImage = await Image.create({ img_url_list: JSON.stringify(imageUrls) })
        console.log(resAddress.id, resOverview.id, resCoordinates.id, resImage.id)
        // tao bang bai viet
        const resPost = await Post.create({
            title,
            price,
            description,
            user_id: userId,
            address_id: resAddress.id,
            overview_id: resOverview.id,
            coordinates_id: resCoordinates.id,
            category_id: category_id,
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
module.exports = {
    createNewPost,
    updateStatusPost,
    updatePost,
    deletePost
};
