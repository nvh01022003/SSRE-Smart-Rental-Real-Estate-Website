const { User, Role, sequelize } = require('../../models/index');
const { where } = require("sequelize");
const { Op } = require('sequelize');


// show all user
// const showAllUser = async () => {
//     try {
//         console.log('showAllUser');
//         const users = await User.findAll({
//             attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'img_avt'],
//             include: [{
//                 model: Role,
//                 attributes: ['type'],
//                 where: {
//                     type: {
//                         [Op.ne]: 'admin' // Loại trừ người dùng có vai trò 'admin'
//                     }
//                 },
//                 required: true // Đảm bảo chỉ lấy người dùng có vai trò
//             }]
//         });

//         if (users) {
//             return {
//                 err: 0,
//                 msg: 'get info user success',
//                 info_user: users,
//             };
//         }
//     } catch (err) {
//         console.log('error show', err);  // Ghi log lỗi để dễ dàng debug
//         return {
//             err: 1,
//             msg: err
//         };
//     }
// };

// show detail user by id
const showAllUser = async () => {
    try {
        console.log('showAllUser');

        // Fetch all users
        const users = await User.findAll({
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'img_avt']
        });

        if (!users) {
            return {
                err: 1,
                msg: 'No users found'
            };
        }

        // Fetch roles for each user using Promise.all
        const usersWithRoles = await Promise.all(users.map(async (user) => {
            const role = await Role.findOne({
                where: {
                    user_id: user.id
                },
                attributes: ['type']
            });
            return {
                ...user.dataValues,
                role: role ? role.type : null
            };
        }));

        // Filter out users with the 'admin' role
        const filteredUsers = usersWithRoles.filter(user => user.role !== 'admin');

        return {
            err: 0,
            msg: 'get info user success',
            info_user: filteredUsers,
        };
    } catch (err) {
        console.log('error show', err);  // Log the error for easier debugging
        return {
            err: 1,
            msg: err
        };
    }
};

// show detail user by id
const showDetailUser = async (userId) => {
    try {
        const user = await User.findOne({
            where: {
                id: userId,
            },
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'img_avt'],
            include: [{
                model: Role,
                attributes: ['type'],
                required: true // Đảm bảo chỉ lấy người dùng có vai trò
            }]
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
// const showDetailUser = async (userId) => {
//     try {
//         // Fetch the user details
//         const user = await User.findOne({
//             where: {
//                 id: userId,
//             },
//             attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'img_avt']
//         });

//         // Fetch the role for the user using Promise.all
//         const [role] = await Promise.all([
//             Role.findOne({
//                 where: {
//                     user_id: user.id
//                 },
//                 attributes: ['type']
//             })
//         ]);

//         return {
//             err: 0,
//             msg: 'get info user success',
//             info_user: {
//                 ...user.dataValues,
//                 role: role ? role.type : null
//             },
//         };
//     } catch (err) {
//         console.log('error show', err);  // Log the error for easier debugging
//         return {
//             err: 1,
//             msg: err
//         };
//     }
// };

// update user by id
// const updateUser = async (userId, data) => {
//     try {
//         const user = await User.update(data, {
//             where: {
//                 id: userId
//             }
//         })
//         if (user) {
//             return {
//                 err: 0,
//                 msg: 'update user success',
//             };
//         }
//     } catch (err) {
//         return {
//             err: 1,
//             msg: err
//         };
//     }
// }
// change role user by id
// Update user by ID and optionally change the role
const updateUser = async (userId, data) => {
    try {
        const user = await User.update(data, {
            where: {
                id: userId
            }
        });
        if (data.role) {
            await Role.update(
                { type: data.role },  // Set the new role type
                { where: { user_id: userId } }  // Condition to find the correct role
            );
        }
        if (user) {
            return {
                err: 0,
                msg: 'Update user success',
            };
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        };
    }
};


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