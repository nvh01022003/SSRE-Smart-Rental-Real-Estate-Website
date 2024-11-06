const bcryptjs = require("bcryptjs");
const gravatar = require("gravatar");
const { where } = require("sequelize");
const helper = require("../../helper/check-coordinates");
const paginationHelper = require("../../helper/pagination");
const { Post, Address, Category, Image, Overview, Coordinates, sequelize } = require("../../models/index");
const middleware = require("../../middleware/upload/uploadImg")
const { response } = require("express");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
// sử dụng cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


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
    const { title, address, price, description, overview, category_id, acreage, target, expire } = contentPost
    console.log('contentPost', contentPost)
    const addressData = address
    const overviewData = {
        ...overview,
        code: generateRandomCode(),
        area: address.city,
        type: category_id,
        target: target,
        expire: expire,
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
const updatePost = async (postId, dataUpdate, files) => {
    const { address_id, Address: addressData, Category: categoryData, Overview: overviewData, overview_id, img_id, Image: imageData, ...postData } = dataUpdate;
    const city = addressData.city;
    const district = addressData.district;
    const detail_address = addressData.detail_address;
    const category_name = categoryData.category_name;
    const target = overviewData.target;

    try {
        // Upload images to Cloudinary
        const imageUrls = [];
        for (const file of files) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }).end(file.buffer);
            });
            imageUrls.push(result.secure_url);
        }

        // Update img_url_list in Image table
        if (img_id) {
            const image = await Image.findOne({ where: { id: img_id } });
            if (image) {
                await image.update({ img_url_list: JSON.stringify(imageUrls) });
            }
        }

        // Update Address
        if (address_id) {
            const address = await Address.findOne({ where: { id: address_id } });
            if (address) {
                await address.update({ city, district, detail_address });
            }
        }

        // Update Category
        if (category_name) {
            const category = await Category.findOne({ where: { category_name } });
            if (category) {
                postData.category_id = category.id;
            }
        }

        // Update Overview target
        if (overview_id) {
            const overview = await Overview.findOne({ where: { id: overview_id } });
            if (overview) {
                await overview.update({ target });
            }
        }

        // Update Post
        const resPost = await Post.update(postData, {
            where: {
                id: postId
            }
        });

        return {
            err: 0,
            msg: 'Update post success',
            post: resPost
        };
    } catch (error) {
        console.log(error);
        return {
            err: 1,
            msg: error.message
        };
    }
};


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
            },
            include: [
                {
                    model: Category,
                    attributes: ['category_name']
                },
                {
                    model: Address,
                    attributes: ['city', 'district', 'detail_address']
                },
                {
                    model: Overview,
                    attributes: ['target', 'expire']
                },
                {
                    model: Image,
                    attributes: ['img_url_list']
                }
            ]
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
const listPostByPage = async (userId, page) => {
    try {
        //pagination
        const totalData = await Post.count({
            where: {
                user_id: userId
            }
        }
        )
        let objectPagination = await paginationHelper.pagination(
            {
                currentPage: 1,
                limitPage: 4
            },
            page,
            totalData
        )
        const resPost = await Post.findAll({
            where: {
                user_id: userId
            },
            limit: objectPagination.limitPage,
            offset: objectPagination.skip,
            attributes: ['id', 'title', 'price', 'createdAt'],
            include: [
                {
                    model: Category,
                    attributes: ['category_name']
                },
                {
                    model: Overview,
                    attributes: ['code', 'area', 'type', "expire"]
                },
                {
                    model: Image,
                    attributes: ['img_url_list']
                }
            ]
        })
        return {
            err: 0,
            msg: resPost,
            objectPagination
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
    listPostByPage
};