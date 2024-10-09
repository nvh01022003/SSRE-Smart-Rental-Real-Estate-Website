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
    const { title, address, price, area, description, images, overview, category_id } = contentPost
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
    const imageUrls = await middleware.uploadImagesToCloudinary(files);
    try {
        const resAddress = await Address.create(addressData)
        const resOverview = await Overview.create(overviewData)
        const resCoordinates = await Coordinates.create(coordinatesData)
        const imageEntries = await Promise.all(
            imageUrls.map(url => Image.create({ url, postId: post.id }, { transaction }))
        )
    } catch (error) {
        return error
    }
}
module.exports = { createNewPost };
