const bcryptjs = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const authServices = require("../../services/auth/auth");
const { where } = require("sequelize");
const { User, Post, Address, Favourite, Report, sequelize } = require("../../models/index");
const { response } = require("express");
require('dotenv').config();
// CREATE 
const getInfoUser = async (userId) => {
    try {
        const user = await User.findOne({
            where: {
                id: userId,
            },
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'img_avt']
        })
        if (user) {
            return {
                err: 0,
                msg: 'get info user success',
                'info_user': user,
            };
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        };
    }
};
// CHANGE INFO USER
const changeInfoUser = async (userId, userUpdate) => {
    if (userUpdate.pass) {
        userUpdate.pass = authServices.hashPassWord(userUpdate.pass);
    }
    try {
        await User.update(userUpdate, { where: { id: userId } })
        return {
            err: 0,
            msg: "Update success"
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        }
    }
}

// SAVE POST
const savePost = async (userId, postId) => {
    try {
        const postSaved = await Favourite.create({
            user_id: userId,
            post_id: postId
        })
        return {
            err: 0,
            msg: postSaved
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        }
    }
}

// REPORT POST
const reportPost = async (userId, postId, desc) => {
    try {
        const report = await Report.create({
            user_id: userId,
            post_id: postId,
            description: desc
        })
        return {
            err: 0,
            msg: "Report created"
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        }
    }
}
// show list post saved
const listPostSaved = async (userId) => {
    try {
        const listPostSaved = await Favourite.findAll({
            where: {
                user_id: userId
            }
        })
        return {
            err: 0,
            msg: listPostSaved
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        }
    }
}
// find post by min price and max price
const findPostByPrice = async (minPrice, maxPrice) => {
    try {
        const listPost = await sequelize.query(`SELECT * FROM posts WHERE price BETWEEN ${minPrice} AND ${maxPrice}`, { type: sequelize.QueryTypes.SELECT });
        return {
            err: 0,
            msg: listPost
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        }
    }
}
// find post by location
const findPostByLocation = async (location) => {
    try {
        const addressResult = await Address.findAll({
            where: {
                city: location
            }
        })
        const addressIDs = addressResult.map((address) => address.id);
        if (addressIDs.length === 0) {
            return {
                err: 0,
                msg: "No post found"
            }
        }
        console.log(addressIDs);
        const posts = await Post.findAll({
            where: {
                address_id: addressIDs
            }
        });
        return {
            err: 0,
            msg: posts
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        }
    }
}
// DELETE POST SAVED
const deletePostSaved = async (userId, postId) => {
    try {
        await Favourite.destroy({
            where: {
                user_id: userId,
                post_id: postId
            }
        })
        return {
            err: 0,
            msg: "Delete post saved success"
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        }
    }
}
// FIND POST BY ACREAGE
const findPostByAcreage = async (minAcreage, maxAcreage) => {
    try {
        const listPost = await sequelize.query(`SELECT * FROM posts WHERE acreage BETWEEN ${minAcreage} AND ${maxAcreage}`, { type: sequelize.QueryTypes.SELECT });
        return {
            err: 0,
            msg: listPost
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        }
    }
}
// PAGINATION POST
const paginationPost = async (page, limit) => {
    try {
        const listPost = await Post.findAll({
            offset: (page - 1) * limit,
            limit: limit
        });
        return {
            err: 0,
            msg: listPost
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        }
    }
}
// FIND POST BY ALL
const findPostByAll = async (minPrice, maxPrice, minAcreage, maxAcreage, location, category) => {
    try {
        whereCondition = {};
        if (minPrice && maxPrice) {
            whereCondition.price = {
                [Op.between]: [minPrice, maxPrice]
            }
        }
        if (minAcreage && maxAcreage) {
            whereCondition.acreage = {
                [Op.between]: [minAcreage, maxAcreage]
            }
        }
        if (location) {
            const addressResult = await Address.findAll({
                where: {
                    city: location
                }
            })
            const addressIDs = addressResult.map((address) => address.id);
            whereCondition.address_id = addressIDs;
        }
        if (category) {
            const categoryResult = await Category.findOne({
                where: {
                    name: category
                }
            })
            whereCondition.category_id = categoryResult.id;
        }
        const listPost = await Post.findAll({
            where: whereCondition
        });
        return {
            err: 0,
            msg: listPost
        }

    } catch (err) {
        return {
            err: 1,
            msg: err
        }
    }
}
module.exports = {
    getInfoUser,
    changeInfoUser,
    savePost,
    reportPost,
    listPostSaved,
    findPostByPrice,
    findPostByLocation,
    findPostByAcreage,
    paginationPost,
    deletePostSaved,
    findPostByAll
};
