const bcryptjs = require("bcryptjs");
const gravatar = require("gravatar");
const { where } = require("sequelize");
const helper = require("../../helper/check-coordinates");
const paginationHelper = require("../../helper/pagination");
const { Post, Address, Category, Image, Overview, Coordinates, User, Wallet, Transaction, PostType, sequelize } = require("../../models/index");
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
    console.log("okee tạo bài viết")
    contentPost = JSON.parse(contentPost); // Ép kiểu qua JSON vì bên client gửi lên dạng string
    const imageUrls = files;
    const { title, address, price, description, overview, category_id, postType_id, acreage, target, expire, totalPayment } = contentPost;

    console.log('contentPost', contentPost);

    // Chuẩn bị dữ liệu cho các bảng liên quan
    const addressData = address;
    const overviewData = {
        ...overview,
        code: generateRandomCode(),
        area: address.city,
        type: category_id,
        target: target,
        expire: expire,
    };
    let addressStr = `${addressData.detail_address}, ${addressData.district}, ${addressData.city}`;
    console.log('addressStr', addressStr);
    const resGeoCoordinates = await helper.getGeocodingData(addressStr);
    const coordinatesData = {
        lat: resGeoCoordinates.lat,
        lon: resGeoCoordinates.lng
    };
    console.log('coordinatesData', coordinatesData);

    // Bắt đầu transaction
    const t = await sequelize.transaction();

    try {
        // Lấy thông tin ví của người dùng trong transaction
        const wallet = await Wallet.findOne({ where: { user_id: userId }, transaction: t });
        if (!wallet) {
            await t.rollback();
            return { err: 1, msg: 'Wallet not found' };
        }

        // Kiểm tra số dư
        if (wallet.balance < totalPayment) {
            await t.rollback();
            return { err: 1, msg: 'Insufficient balance' };
        }

        // Lưu lại số dư trước khi trừ tiền
        const initialBalance = parseFloat(wallet.balance);

        // Trừ tiền từ ví
        wallet.balance = initialBalance - parseFloat(totalPayment);
        await wallet.save({ transaction: t }); // Lưu lại số dư mới trong transaction

        // Tạo các bản ghi liên quan trong transaction
        const [resAddress, resOverview, resCoordinates, resImage] = await Promise.all([
            Address.create(addressData, { transaction: t }),
            Overview.create(overviewData, { transaction: t }),
            Coordinates.create(coordinatesData, { transaction: t }),
            Image.create({ img_url_list: JSON.stringify(imageUrls) }, { transaction: t })
        ]);
        // Tạo bài viết trong transaction
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
            img_id: resImage.id,
            postType_id: postType_id
        }, { transaction: t });

        // Tạo bản ghi giao dịch với thông tin cần thiết trong transaction
        await Transaction.create({
            wallet_id: wallet.id,
            paycode: "PayPost" + new Date().getTime(),
            amount: totalPayment,
            status: 'Thành công',
            transactionType: 'thanh toán',
            content: `Phí đăng bài viết ID:${resPost.id}`,
            balanceAfterTransaction: wallet.balance
        }, { transaction: t });
        // Commit transaction sau khi tất cả thao tác thành công
        await t.commit();

        return {
            err: 0,
            msg: 'Create post success',
            post: resPost
        };
    } catch (error) {
        console.log('Error in createNewPost:', error);

        // Rollback transaction nếu có lỗi
        await t.rollback();

        // Lấy lại thông tin ví sau khi rollback để có số dư ban đầu
        const wallet = await Wallet.findOne({ where: { user_id: userId } });

        // Tạo bản ghi giao dịch thất bại
        if (wallet) {
            await Transaction.create({
                wallet_id: wallet.id,
                paycode: "PayPost" + new Date().getTime(),
                amount: totalPayment,
                status: 'Thất bại',
                transactionType: 'thanh toán',
                content: `Phi đăng bài viết`,
                balanceAfterTransaction: wallet.balance // Số dư ban đầu vì chưa trừ tiền
            });
        }
        return {
            err: 1,
            msg: error.message
        };
    }
};
// GIA HẠN BÀI ĐĂNG 
const extendPost = async (userId, postId, newExpireDate, totalPayment, newPostTypeId) => {
    // Bắt đầu transaction
    const t = await sequelize.transaction();

    try {
        // Lấy thông tin ví của người dùng trong transaction
        const wallet = await Wallet.findOne({ where: { user_id: userId }, transaction: t });
        if (!wallet) {
            await t.rollback();
            return { err: 1, msg: 'Wallet not found' };
        }

        // Kiểm tra số dư
        if (wallet.balance < totalPayment) {
            await t.rollback();
            return { err: 1, msg: 'Insufficient balance' };
        }

        // Lưu lại số dư trước khi trừ tiền
        const initialBalance = parseFloat(wallet.balance);

        // Trừ tiền từ ví
        wallet.balance = initialBalance - parseFloat(totalPayment);
        await wallet.save({ transaction: t }); // Lưu lại số dư mới trong transaction

        // Cập nhật ngày hết hạn trong bảng Overview
        const post = await Post.findOne({ where: { id: postId }, transaction: t });
        if (!post) {
            await t.rollback();
            return { err: 1, msg: 'Post not found' };
        }

        // Cập nhật expire trong bảng Overview
        const updatedOverview = await Overview.update(
            {
                expire: newExpireDate, // Cập nhật ngày hết hạn mới
            },
            {
                where: { id: post.overview_id }, // Dùng overview_id từ bài viết
                transaction: t,
            }
        );

        if (updatedOverview[0] !== 1) {
            await t.rollback();
            return { err: 1, msg: 'Failed to update expire date in Overview' };
        }

        // Cập nhật postType_id trong bảng Post
        const updatedPost = await Post.update(
            {
                postType_id: newPostTypeId, // Cập nhật postType_id mới
                status: 0, // Cập nhật status thành 0
            },
            {
                where: { id: postId },
                transaction: t,
            }
        );

        if (updatedPost[0] !== 1) {
            await t.rollback();
            return { err: 1, msg: 'Failed to update postType_id and status in Post' };
        }

        // Tạo bản ghi giao dịch với thông tin cần thiết trong transaction
        await Transaction.create({
            wallet_id: wallet.id,
            paycode: "ExtendPost" + new Date().getTime(),
            amount: totalPayment,
            status: 'Thành công',
            transactionType: 'thanh toán',
            content: `Gia hạn bài viết ID:${postId}`,
            balanceAfterTransaction: wallet.balance,
        }, { transaction: t });

        // Commit transaction sau khi tất cả thao tác thành công
        await t.commit();

        return {
            err: 0,
            msg: 'Post has been extended successfully',
            postId,
        };
    } catch (error) {
        console.log('Error in extendPost:', error);

        // Rollback transaction nếu có lỗi
        await t.rollback();

        // Lấy lại thông tin ví sau khi rollback để có số dư ban đầu
        const wallet = await Wallet.findOne({ where: { user_id: userId } });

        // Tạo bản ghi giao dịch thất bại
        if (wallet) {
            await Transaction.create({
                wallet_id: wallet.id,
                paycode: "ExtendPost" + new Date().getTime(),
                amount: totalPayment,
                status: 'Thất bại',
                transactionType: 'thanh toán',
                content: `Phi gia hạn bài viết`,
                balanceAfterTransaction: wallet.balance, // Số dư ban đầu vì chưa trừ tiền
            });
        }

        return {
            err: 1,
            msg: error.message || 'Failed to extend post.',
        };
    }
};


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
        // Tìm bài viết theo ID
        const post = await Post.findOne({
            where: {
                id: postId
            }
        });
        if (!post) {
            return {
                err: 1,
                msg: 'Post not found'
            };
        }
        // Xóa bài viết, phương thức này sẽ kích hoạt hook beforeDestroy
        await post.destroy();

        return {
            err: 0,
            msg: 'Delete post success',
            post: post
        };
    } catch (error) {
        console.log(error);
        return {
            err: 1,
            msg: error.message
        };
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
                user_id: userId,
                status: 0  // Chỉ lấy các bài đăng có status = 0
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
                    model: User,
                    attributes: ['firstName', 'lastName', 'email', 'phone', 'img_avt']
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
// show all soft delete posts
const showAllSoftDeletePosts = async (userId) => {
    try {
        const post = await Post.findAll({
            where: {
                user_id: userId,
                status: 1  // Chỉ lấy các bài đăng có status = 1
            },
            order: [['createdAt', 'DESC']], // Sắp xếp theo thời gian tạo, từ mới nhất
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
                    attributes: ['id', 'category_name']
                },
                {
                    model: User,
                    attributes: ['firstName', 'lastName', 'email', 'phone', 'img_avt']
                },
                {
                    model: Overview,
                    attributes: ['target', 'expire']
                },
            ]
        });

        return {
            err: 0,
            posts: post
        };
    } catch (err) {
        return {
            err: 1,
            posts: [],
            msg: err
        };
    }
}
//  Khôi phục bài đăng đã xóa mềm (status = 1) của người dùng cụ thể
const restoreSoftDeletedPost = async (postId) => {
    try {
        const now = new Date(); // Ngày hiện tại

        
        const post = await Post.findOne({
            where: {
                id: postId,
                status: 1 // Chỉ tìm bài đăng có status = 1 (đã xóa mềm)
            }
        });

        // Nếu không tìm thấy bài đăng hoặc bài đăng không bị xóa mềm
        if (!post) {
            return {
                err: 1,
                msg: 'Post not found or is already active.'
            };
        }

        // Truy vấn `Overview` để lấy thông tin ngày hết hạn
        const overview = await Overview.findOne({
            where: {
                id: post.overview_id // Liên kết với overview_id của bài đăng
            }
        });

        // Nếu không tìm thấy `Overview` hoặc hết hạn
        if (!overview || overview.expire < now) {
            return {
                err: 1,
                msg: 'Post cannot be restored because it is associated with an expired overview.'
            };
        }

        // Khôi phục bài đăng bằng cách cập nhật status
        const restoredPost = await Post.update(
            { status: 0 }, // Khôi phục lại status = 0 (đang hoạt động)
            {
                where: { id: postId }
            }
        );

        // Kiểm tra kết quả khôi phục
        if (restoredPost[0] === 1) {
            return {
                err: 0,
                msg: 'Post has been restored successfully.'
            };
        } else {
            return {
                err: 1,
                msg: 'Post not found, does not belong to this user, or is already active.'
            };
        }
    } catch (error) {
        console.error(error);
        return {
            err: 1,
            msg: error.message || 'Failed to restore post.'
        };
    }
};
// Xóa mềm bài đăng của user
const softDeletePost = async (postId) => {
    try {
        await Post.update(
            { status: 1 },
            {
                where: {
                    id: postId
                }
            }
        );
        return { err: 0, msg: 'Post soft-deleted successfully.' };
    } catch (error) {
        return { err: 1, msg: error.message };
    }
};


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
    listPostByPage,
    showAllSoftDeletePosts,
    restoreSoftDeletedPost,
    softDeletePost,
    extendPost
};