const { User, Role, sequelize } = require('../../models/index');
const { where } = require("sequelize");
const { Op } = require('sequelize');


// show all user
const showAllUser = async () => {
    try {
        console.log('showAllUser')
        const user = await User.findAll({
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
}
// show detail user by id
const showDetailUser = async (userId) => {
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
}
// update user by id
const updateUser = async (userId, data) => {
    try {
        const user = await User.update(data, {
            where: {
                id: userId
            }
        })
        if (user) {
            return {
                err: 0,
                msg: 'update user success',
            };
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        };
    }
}
// change role user by id
const changeRoleUser = async (userId, role) => {
    try {
        const user = await Role.update({
            type: role
        }, {
            where: {
                userId: userId
            }
        })
        if (user) {
            return {
                err: 0,
                msg: 'change role user success',
            };
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        };
    }
}
// delete user by id
const deleteUser = async (userId) => {
    try {
        const user = await User.destroy({
            where: {
                id: userId
            }
        })
        if (user) {
            return {
                err: 0,
                msg: 'delete user success',
            };
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        };
    }
}
// delete user by select list id
const deleteUsers = async (listId) => {
    try {
        const user = await User.destroy({
            where: {
                id: {
                    [Op.in]: listId
                }
            }
        })
        if (user) {
            return {
                err: 0,
                msg: 'delete user success',
            };
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        };
    }
}
// find user by enail
const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (user) {
            return {
                err: 0,
                msg: 'find user success',
                'info_user': user,
            };
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        };
    }
}
// find user by role
const findUserByRole = async (role) => {
    try {
        const user = await Role.findAll({
            where: {
                type: role
            }
        })
        if (user) {
            return {
                err: 0,
                msg: 'find user success',
                'info_user': user,
            };
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        };
    }
}
module.exports = {
    showAllUser,
    showDetailUser,
    updateUser,
    changeRoleUser,
    deleteUser,
    deleteUsers,
    findUserByEmail,
    findUserByRole
}