const bcryptjs = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");
const { User, Favourite, Report, sequelize } = require("../../models/index");
const { response } = require("express");
require('dotenv').config();
// GET INFO USER
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
    try {
        await User.update({
            firstName: userUpdate.firstName,
            lastName: userUpdate.lastName,
            email: userUpdate.email,
            phone: userUpdate.phone
        }, { where: { id: userId } })
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
module.exports = { getInfoUser, changeInfoUser, savePost, reportPost };
