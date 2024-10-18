const bcryptjs = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const paginationHelper = require("../../helper/pagination");
const authServices = require("../../services/auth/auth");
const { where } = require("sequelize");
const { Op } = require('sequelize');
const { User, Post, Address, Favourite, Report, Category, sequelize } = require("../../models/index");
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
// show list post saved sử dung pagination
const listPostSaved = async (userId, page) => {
    try {
        const totalData = await Favourite.count({
            where: {
                user_id: userId
            }
        });
        let objectPagination = await paginationHelper.pagination(
            {
                currentPage: 1,
                limitPage: 2
            },
            page,
            totalData
        )
        // các bài viết theo trang
        const posts = await Favourite.findAll({
            where: {
                user_id: userId
            },
            limit: objectPagination.limitPage,
            offset: objectPagination.skip,
            order: [['createdAt', 'DESC']]
        });
        return {
            err: 0,
            msg: {
                listPost: posts,
                objectPagination
            }
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
// FIND POST BY ALL
const findPostByAll = async (minPrice, maxPrice, location, minAcreage, maxAcreage, categoryCode, page) => {
    try {
        let whereCondition = {};
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

        if (categoryCode) {
            whereCondition.category_id = categoryCode;
        }
        const totalData = await Post.count({ where: whereCondition });
        let objectPagination = await paginationHelper.pagination(
            {
                currentPage: 1,
                limitPage: 4
            },
            page,
            totalData
        )
        const posts = await Post.findAll({
            where: whereCondition,
            limit: objectPagination.limitPage,
            offset: objectPagination.skip,
            order: [['createdAt', 'DESC']]
        });
        // console.log(posts);
        return {
            err: 0,
            msg: {
                listPost: posts,
                objectPagination
            }
        }

    } catch (err) {
        return {
            err: 1,
            msg: err
        }
    }
}
// show list post by page pagination
const listPostByPage = async (page) => {
    try {
        const limit = 5;
        const offset = (page - 1) * limit;
        const listPost = await Post.findAll({
            limit: limit,
            offset: offset
        })
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
// show detail post
const showDetailPost = async (postId) => {
    try {
        const post = await Post.findOne({
            where: {
                id: postId
            }
        })
        return {
            err: 0,
            msg: post
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        }
    }
}
// show category
const showCategory = async () => {
    try {
        const category = await Category.findAll();
        return {
            err: 0,
            msg: category
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
    deletePostSaved,
    findPostByAll,
    listPostByPage,
    showDetailPost,
    showCategory
};
