const { User, Role, UpgradeRequest, sequelize } = require('../../models/index');
const paginationHelper = require("../../helper/pagination");
const { where } = require("sequelize");
const { Op } = require('sequelize');

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

        // Fetch roles for each user sequentially
        const usersWithRoles = [];
        for (const user of users) {
            const role = await Role.findOne({
                where: {
                    user_id: user.id
                },
                attributes: ['type']
            });
            usersWithRoles.push({
                ...user.dataValues,
                role: role ? role.type : null
            });
        }

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

const rejectUpgradeRequest = async (userId) => {
    try {
        // Update the status of the upgrade request to 1 (approved)
        await UpgradeRequest.update({
            status: 1
        }, {
            where: {
                user_id: userId
            }
        });
        return {
            err: 0,
            msg: 'reject upgrade request successfully',
        };
    } catch (err) {
        return {
            err: 1,
            msg: err.message || 'Đã xảy ra lỗi'  // Trả về thông báo lỗi để hỗ trợ kiểm tra và ghi nhật ký.
        };
    }
};


const { Wallet } = require('../../models/index');
const changeRoleUser = async (userId) => {
    let transaction;
    try {
        // Bắt đầu một transaction để đảm bảo các bước bên trong nó được thực hiện một cách đồng bộ.
        transaction = await sequelize.transaction();

        // Thử cập nhật vai trò của người dùng thành 'landlord' trong bảng Role.
        // Tham số 'transaction' được truyền vào để đảm bảo thao tác này là một phần của transaction.
        const user = await Role.update({
            type: 'ladnlord'
        }, {
            where: {
                user_id: userId
            },
            transaction
        });

        // Kiểm tra xem có dòng nào bị ảnh hưởng bởi thao tác update hay không.
        // Nếu không có dòng nào được cập nhật (user[0] === 0), có thể là người dùng không được tìm thấy hoặc vai trò không thay đổi.
        // Trong trường hợp này, rollback transaction và trả về thông báo lỗi.
        if (user[0] === 0) {
            await transaction.rollback();
            return {
                err: 1,
                msg: 'Không tìm thấy người dùng hoặc vai trò không thay đổi'
            };
        }

        // Nếu vai trò của người dùng được cập nhật thành công, thêm một bản ghi vào bảng Wallet.
        // Việc này sẽ tạo một ví cho người dùng với số dư mặc định là 0, trong cùng transaction.
        const wallet = await Wallet.create({
            user_id: userId,
            balance: 0
        }, { transaction });

        // Update the status of the upgrade request to 1 (approved)
        await UpgradeRequest.update({
            status: 1
        }, {
            where: {
                user_id: userId
            },
            transaction
        });

        // Commit transaction nếu cả hai thao tác cập nhật vai trò và tạo ví thành công.
        // Điều này sẽ lưu tất cả thay đổi trong transaction vào cơ sở dữ liệu một cách vĩnh viễn.
        await transaction.commit();

        // Trả về thông báo thành công nếu toàn bộ quy trình hoàn thành mà không gặp lỗi.
        return {
            err: 0,
            msg: 'Thay đổi vai trò người dùng thành công và ví đã được tạo',
        };
    } catch (err) {
        // Nếu có lỗi xảy ra ở bất kỳ bước nào trong khối try, rollback transaction để hoàn tác mọi thay đổi.
        if (transaction) await transaction.rollback();
        return {
            err: 1,
            msg: err.message || 'Đã xảy ra lỗi'  // Trả về thông báo lỗi để hỗ trợ kiểm tra và ghi nhật ký.
        };
    }
};

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

// hiển thị các yêu cầu nâng cấp tài khoản
const showAllUpgradeRequest = async (page) => {
    try {
        // 1. Đếm tổng số yêu cầu nâng cấp có trạng thái '0' (chưa được phê duyệt)
        const totalData = await UpgradeRequest.count({
            where: {
                status: 0 // Chỉ đếm các yêu cầu có status = 0
            }
        });

        // 2. Thiết lập phân trang (pagination)
        // Gọi hàm trợ giúp 'paginationHelper.pagination' để tính toán số trang và vị trí của dữ liệu dựa trên trang hiện tại.
        // Các tham số bao gồm:
        // - currentPage: trang hiện tại (mặc định là 1 nếu không có trang được truyền vào)
        // - limitPage: số lượng yêu cầu nâng cấp hiển thị trên mỗi trang (ở đây là 5 yêu cầu mỗi trang)
        // - page: trang mà người dùng yêu cầu (được truyền vào như đối số của hàm)
        // - totalData: tổng số yêu cầu nâng cấp tính từ bước 1.
        const pagination = await paginationHelper.pagination(
            {
                currentPage: 1, // mặc định là trang 1
                limitPage: 5    // số yêu cầu nâng cấp hiển thị trên mỗi trang
            },
            page,
            totalData
        );

        // 3. Tìm tất cả các yêu cầu nâng cấp có trạng thái '0' (chưa được phê duyệt)
        // Truy vấn này giới hạn số lượng kết quả dựa trên phân trang đã tính toán từ bước 2.
        // Các yêu cầu nâng cấp được lấy với các thuộc tính cụ thể: 'user_id', 'full_name', 'date_of_birth', 'address', 'contact', 'citizen_id', 'id_card_image_url', và 'status'.
        // Tham số 'limit' giới hạn số lượng bản ghi trả về mỗi trang, và 'offset' bỏ qua số lượng bản ghi cần thiết để truy cập trang mong muốn.
        const upgradeRequests = await UpgradeRequest.findAll({
            where: {
                status: 0
            },
            limit: pagination.limitPage,
            offset: pagination.skip,
            attributes: ['user_id', 'full_name', 'date_of_birth', 'address', 'contact', 'citizen_id', 'id_card_image_url', 'status'],
            include: [
                {
                    model: User,
                    attributes: ['email'],
                    where: {
                        id: sequelize.col('UpgradeRequest.user_id')
                    }
                }
            ]
        });

        // 4. Nếu có yêu cầu nâng cấp được tìm thấy, trả về kết quả thành công với danh sách yêu cầu nâng cấp và thông tin phân trang
        if (upgradeRequests) {
            return {
                err: 0,               // Không có lỗi (err = 0)
                res: upgradeRequests,  // Danh sách yêu cầu nâng cấp
                pagination: pagination // Thông tin phân trang
            };
        }
    } catch (err) {
        // 5. Nếu có lỗi xảy ra trong quá trình thực thi, trả về thông báo lỗi
        return {
            err: 1,                // Đánh dấu có lỗi (err = 1)
            msg: err.message || 'An error occurred' // Thông báo lỗi (nếu có)
        };
    }
};


module.exports = {
    showAllUser,
    showDetailUser,
    updateUser,
    changeRoleUser,
    deleteUser,
    deleteUsers,
    findUserByEmail,
    findUserByRole,
    showAllUpgradeRequest,
    rejectUpgradeRequest
}