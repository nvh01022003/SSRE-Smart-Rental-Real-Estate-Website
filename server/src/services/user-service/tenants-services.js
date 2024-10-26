// const bcryptjs = require("bcryptjs");
// const gravatar = require("gravatar");
// const jwt = require("jsonwebtoken");
// const paginationHelper = require("../../helper/pagination");
// const authServices = require("../../services/auth/auth");
// const { where } = require("sequelize");
// const { Op } = require('sequelize');
// const { User, Post, Address, Image, Favourite, Report, Category, Overview, Coordinates, UpgradeRequest, sequelize } = require("../../models/index");
// const { response } = require("express");
// require('dotenv').config();
// // CREATE 
// const getInfoUser = async (userId) => {
//     try {
//         const user = await User.findOne({
//             where: {
//                 id: userId,
//             },
//             attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'img_avt']
//         })
//         if (user) {
//             return {
//                 err: 0,
//                 msg: 'get info user success',
//                 'info_user': user,
//             };
//         }
//     } catch (err) {
//         return {
//             err: 1,
//             msg: err
//         };
//     }
// };
// // CHANGE INFO USER
// const changeInfoUser = async (userId, userUpdate) => {
//     if (userUpdate.pass) {
//         userUpdate.pass = authServices.hashPassWord(userUpdate.pass);
//     }
//     try {
//         await User.update(userUpdate, { where: { id: userId } })
//         return {
//             err: 0,
//             msg: "Update success"
//         }
//     } catch (err) {
//         return {
//             err: 1,
//             msg: err
//         }
//     }
// }

// // SAVE POST
// const savePost = async (userId, postId) => {
//     try {
//         const postSaved = await Favourite.create({
//             user_id: userId,
//             post_id: postId
//         })
//         return {
//             err: 0,
//             msg: postSaved
//         }
//     } catch (err) {
//         return {
//             err: 1,
//             msg: err
//         }
//     }
// }

// // REPORT POST
// const reportPost = async (userId, postId, desc) => {
//     try {
//         const report = await Report.create({
//             user_id: userId,
//             post_id: postId,
//             description: desc
//         })
//         return {
//             err: 0,
//             msg: "Report created"
//         }
//     } catch (err) {
//         return {
//             err: 1,
//             msg: err
//         }
//     }
// }
// // show list post saved sử dung pagination
// const listPostSaved = async (userId, page) => {
//     try {
//         const totalData = await Favourite.count({
//             where: {
//                 user_id: userId
//             }
//         });
//         let objectPagination = await paginationHelper.pagination(
//             {
//                 currentPage: 1,
//                 limitPage: 2
//             },
//             page,
//             totalData
//         )
//         // các bài viết theo trang
//         const listPostSave = await Favourite.findAll({
//             where: {
//                 user_id: userId
//             },
//             limit: objectPagination.limitPage,
//             offset: objectPagination.skip,
//             order: [['createdAt', 'DESC']],
//             // show thông tin chi tiết của bài viết gồm address, img, user tạo
//             include: [
//                 {
//                     model: Post,
//                     include: [
//                         {
//                             model: Address,
//                             attributes: ['city', 'district', 'detail_address']
//                         },
//                         {
//                             model: Image,
//                             attributes: ['img_url_list']
//                         },
//                         {
//                             model: User,
//                             attributes: ['firstName', 'lastName', 'email', 'phone', 'img_avt']
//                         },
//                         {
//                             model: Category,
//                             attributes: ['category_name']
//                         }
//                     ]
//                 }
//             ]

//         });
//         listPostSave.forEach((favourite) => {
//             try {
//                 favourite.dataValues.Post.Images.forEach((image) => {
//                     image.img_url_list = JSON.parse(image.img_url_list);
//                 });
//             } catch (error) {
//                 console.error(`Fail to parse img_url_list for post ID ${favourite.post_id}:`, error);
//                 favourite.dataValues.Post.Images.forEach((image) => {
//                     image.img_url_list = [];
//                 });
//             }
//         });
//         return {
//             err: 0,
//             msg: {
//                 listPost: listPostSave,
//                 objectPagination
//             }
//         }
//     } catch (err) {
//         return {
//             err: 1,
//             msg: err
//         }
//     }
// }
// // DELETE POST SAVED
// const deletePostSaved = async (userId, postId) => {
//     try {
//         await Favourite.destroy({
//             where: {
//                 user_id: userId,
//                 post_id: postId
//             }
//         })
//         return {
//             err: 0,
//             msg: "Delete post saved success"
//         }
//     } catch (err) {
//         return {
//             err: 1,
//             msg: err
//         }
//     }
// }
// // FIND POST BY ALL
// const findPostByAll = async (minPrice, maxPrice, location, minAcreage, maxAcreage, categoryCode, page) => {
//     try {
//         let whereCondition = {};
//         if (minPrice && maxPrice) {
//             whereCondition.price = {
//                 [Op.between]: [minPrice, maxPrice]
//             }
//         }
//         if (minAcreage && maxAcreage) {
//             whereCondition.acreage = {
//                 [Op.between]: [minAcreage, maxAcreage]
//             }
//         }
//         if (location) {
//             const addressResult = await Address.findAll({
//                 where: {
//                     city: location
//                 }
//             })
//             const addressIDs = addressResult.map((address) => address.id);
//             whereCondition.address_id = addressIDs;
//         }

//         if (categoryCode) {
//             whereCondition.category_id = categoryCode;
//         }
//         const totalData = await Post.count({ where: whereCondition });
//         let objectPagination = await paginationHelper.pagination(
//             {
//                 currentPage: 1,
//                 limitPage: 4
//             },
//             page,
//             totalData
//         )
//         const posts = await Post.findAll({
//             where: whereCondition,
//             limit: objectPagination.limitPage,
//             offset: objectPagination.skip,
//             order: [['createdAt', 'DESC']],
//             // trả về đủ thông tin address, img
//             include: [
//                 {
//                     model: Address,
//                     attributes: ['city', 'district', 'detail_address']
//                 },
//                 {
//                     model: Image,
//                     attributes: ['img_url_list']
//                 },
//                 {
//                     model: Category,
//                     attributes: ['category_name']
//                 },
//                 {
//                     model: User,
//                     attributes: ['firstName', 'lastName', 'email', 'phone', 'img_avt']
//                 },

//             ]

//         });
//         posts.forEach((post) => {
//             try {
//                 post.dataValues.images = JSON.parse(post.Image.img_url_list);
//             } catch (error) {
//                 console.log("Fail to parse img_url_list");
//                 post.dataValues.img_url_list = [];
//             }
//         });
//         return {
//             err: 0,
//             msg: {
//                 listPost: posts,
//                 objectPagination
//             }
//         }

//     } catch (err) {
//         return {
//             err: 1,
//             msg: err
//         }
//     }
// }
// // show list post by page pagination
// const listPostByPage = async (page) => {
//     try {
//         const limit = 5;
//         const offset = (page - 1) * limit;
//         const listPost = await Post.findAll({
//             limit: limit,
//             offset: offset
//         })
//         return {
//             err: 0,
//             msg: listPost
//         }
//     } catch (err) {
//         return {
//             err: 1,
//             msg: err
//         }
//     }
// }
// // show detail post
// const showDetailPost = async (postId) => {
//     try {
//         const post = await Post.findOne({
//             where: {
//                 id: postId
//             }
//         })
//         // tim chi tiet cac bang khac : category, address, user, overviews dùng promise.all
//         const [category, address, user, overviews, map, image] = await Promise.all([
//             Category.findOne({
//                 where: {
//                     id: post.category_id
//                 },
//                 attributes: ['category_name']
//             }),
//             Address.findOne({
//                 where: {
//                     id: post.address_id
//                 },
//                 attributes: ['city', 'district', 'detail_address']
//             }),
//             User.findOne({
//                 where: {
//                     id: post.user_id
//                 },
//                 attributes: ['firstName', 'lastName', 'email', 'phone', 'img_avt']
//             }),
//             Overview.findOne({
//                 where: {
//                     id: post.overview_id
//                 },
//                 attributes: ['code', 'area', 'type', 'target', 'expire']
//             }),
//             Coordinates.findOne({
//                 where: {
//                     id: post.coordinates_id
//                 },
//                 attributes: ['lat', 'lon']
//             }),
//             Image.findOne({
//                 where: {
//                     id: post.img_id
//                 },
//                 attributes: ['img_url_list']
//             })
//         ])
//         post.dataValues.map = `<iframe src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d7668.902703874087!2d${map.dataValues.lon}!3d${map.dataValues.lat}!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1729530897356!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
//         post.dataValues.category = category;
//         post.dataValues.address = address;
//         post.dataValues.user = user;
//         post.dataValues.overviews = overviews;
//         post.dataValues.images = JSON.parse(image.dataValues.img_url_list);
//         return {
//             err: 0,
//             msg: post
//         }
//     } catch (err) {
//         return {
//             err: 1,
//             msg: err
//         }
//     }
// }
// // show category
// const showCategory = async () => {
//     try {
//         const category = await Category.findAll();
//         return {
//             err: 0,
//             msg: category
//         }
//     } catch (err) {
//         return {
//             err: 1,
//             msg: err
//         }
//     }
// }
// // req upgrade to landlord để gửi yêu cầu nâng cấp lên landlord
// const reqUpdateToLandlord = async (userId, info, imgKYC) => {
//     try {
//         info = JSON.parse(info)
//         console.log('info', info);
//         imgKYC = JSON.stringify(imgKYC);
//         console.log(imgKYC);
//         const userVerification = await UpgradeRequest.create({
//             user_id: userId,
//             full_name: info.full_name,
//             date_of_birth: info.date_of_birth,
//             address: info.address,
//             contact: info.contact,
//             id_card_image_url: imgKYC,
//             citizen_id: info.citizen_id,
//         })
//         console.log('userVerification', userVerification);
//         return {
//             err: 0,
//             msg: "Request update to landlord success"
//         }
//     } catch (err) {
//         return {
//             err: 1,
//             msg: err
//         }
//     }

// }
// module.exports = {
//     getInfoUser,
//     changeInfoUser,
//     savePost,
//     reportPost,
//     listPostSaved,
//     deletePostSaved,
//     findPostByAll,
//     listPostByPage,
//     showDetailPost,
//     showCategory,
//     reqUpdateToLandlord

// };
const bcryptjs = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const paginationHelper = require("../../helper/pagination");
const authServices = require("../../services/auth/auth");
const { where } = require("sequelize");
const { Op } = require('sequelize');
const { User, Post, Address, Image, Favourite, Report, Category, Overview, Coordinates, UpgradeRequest, sequelize } = require("../../models/index");
const { response } = require("express");
const e = require("express");
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
        const listPostSave = await Favourite.findAll({
            where: {
                user_id: userId
            },
            limit: objectPagination.limitPage,
            offset: objectPagination.skip,
            order: [['createdAt', 'DESC']],
            // show thông tin chi tiết của bài viết gồm address, img, user tạo
            include: [
                {
                    model: Post,
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
                            model: User,
                            attributes: ['firstName', 'lastName', 'email', 'phone', 'img_avt']
                        },
                        {
                            model: Category,
                            attributes: ['category_name']
                        }
                    ]
                }
            ]

        });
        listPostSave.forEach((favourite) => {
            try {
                favourite.dataValues.Post.Images.forEach((image) => {
                    image.img_url_list = JSON.parse(image.img_url_list);
                });
                // console.log(favourite.dataValues.Post.Images[0].img_url_list[0]);
                // tạo thêm một thuộc tính là images trong mỗi bài viết và lưu favourite.dataValues.Post.Images[0].img_url_list[0] và nhận được res trả về trong listPostSave
                favourite.dataValues.Post.images = favourite.dataValues.Post.Images[0].img_url_list;
                console.log(favourite.dataValues.Post.images);
            } catch (error) {
                console.error(`Fail to parse img_url_list for post ID ${favourite.post_id}:`, error);
                favourite.dataValues.Post.Images.forEach((image) => {
                    image.img_url_list = [];
                });
            }
        });
        return {
            err: 0,
            msg: {
                listPost: listPostSave,
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
            order: [['createdAt', 'DESC']],
            // trả về đủ thông tin address, img
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
                    attributes: ['category_name']
                },
                {
                    model: User,
                    attributes: ['firstName', 'lastName', 'email', 'phone', 'img_avt']
                },

            ]

        });
        posts.forEach((post) => {
            try {
                post.dataValues.Images.forEach((image) => {
                    image.img_url_list = JSON.parse(image.img_url_list);
                });
                console.log(post.dataValues.Images[0].img_url_list);
            } catch (error) {
                console.log("Fail to parse img_url_list" + error);
                post.dataValues.img_url_list = [];
            }
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
        // tim chi tiet cac bang khac : category, address, user, overviews dùng promise.all
        const [category, address, user, overviews, map, image] = await Promise.all([
            Category.findOne({
                where: {
                    id: post.category_id
                },
                attributes: ['category_name']
            }),
            Address.findOne({
                where: {
                    id: post.address_id
                },
                attributes: ['city', 'district', 'detail_address']
            }),
            User.findOne({
                where: {
                    id: post.user_id
                },
                attributes: ['firstName', 'lastName', 'email', 'phone', 'img_avt']
            }),
            Overview.findOne({
                where: {
                    id: post.overview_id
                },
                attributes: ['code', 'area', 'type', 'target', 'expire']
            }),
            Coordinates.findOne({
                where: {
                    id: post.coordinates_id
                },
                attributes: ['lat', 'lon']
            }),
            Image.findOne({
                where: {
                    id: post.img_id
                },
                attributes: ['img_url_list']
            })
        ])
        post.dataValues.map = `<iframe src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d7668.902703874087!2d${map.dataValues.lon}!3d${map.dataValues.lat}!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1729530897356!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
        post.dataValues.category = category;
        post.dataValues.address = address;
        post.dataValues.user = user;
        post.dataValues.overviews = overviews;
        post.dataValues.images = JSON.parse(image.dataValues.img_url_list);
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
// req upgrade to landlord để gửi yêu cầu nâng cấp lên landlord
const reqUpdateToLandlord = async (userId, info, imgKYC) => {
    try {
        info = JSON.parse(info)
        imgKYC = JSON.stringify(imgKYC);
        console.log(imgKYC);
        const userVerification = await UpgradeRequest.create({
            user_id: userId,
            full_name: info.full_name,
            date_of_birth: info.date_of_birth,
            address: info.address,
            contact: info.contact,
            citizen_id: info.citizen_id,
            id_card_image_url: imgKYC
        })
        return {
            err: 0,
            msg: "Request update to landlord success"
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
    showCategory,
    reqUpdateToLandlord

};
