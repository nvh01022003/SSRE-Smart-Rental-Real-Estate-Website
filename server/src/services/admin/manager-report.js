// services/roleService.js
const { Role,Post,Category,Transaction } = require('../../models'); // Điều chỉnh đường dẫn models
const { Op } = require('sequelize');

//Tổng số user
const getTotalUsers = async () => {
    try {
        const totalUsers = await Role.count({
            where: {
                type: {
                    [Op.notLike]: 'admin', 
                },
            },
        });

        return {
            success: true,
            total: totalUsers,
            message: 'Tổng số người dùng',
        };
    } catch (error) {
        throw new Error('Lỗi khi đếm số người dùng: ' + error.message);
    }
};

// Hàm đếm số người dùng mới trong ngày hôm nay (không bao gồm admin)
const getNewUsersToday = async () => {
    try {
        // Lấy ngày hôm nay
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày hôm nay

        const newUsersToday = await Role.count({
            where: {
                createdAt: {
                    [Op.gte]: today, // Người dùng được tạo từ đầu ngày hôm nay trở đi
                },
                type: {
                    [Op.ne]: 'admin', // Loại bỏ admin
                },
            },
        });

        return {
            success: true,
            newUsersToday: newUsersToday,
            message: 'Số người dùng mới hôm nay',
        };
    } catch (error) {
        throw new Error('Lỗi khi đếm số người dùng mới hôm nay: ' + error.message);
    }
};

// Hàm đếm tổng số bài đăng
const getTotalPosts = async () => {
    try {
        const totalPosts = await Post.count({
            where: {
                status: { [Op.ne]: 1 }, // Loại bỏ các bài đăng có status là 1 (giả sử status = 1 là bị xóa mềm)
            },
        });

        return {
            success: true,
            total: totalPosts,
            message: 'Tổng số bài đăng',
        };
    } catch (error) {
        throw new Error('Lỗi khi đếm số bài đăng: ' + error.message);
    }
};

// Hàm đếm tổng số bài đăng xoá mềm
const getTotalDeletePosts = async () => {
    try {
        const totalPosts = await Post.count({
            where: {
                status: { [Op.ne]: 0 }, // Loại bỏ các bài đăng có status là 0 
            },
        });

        return {
            success: true,
            total: totalPosts,
            message: 'Tổng số bài đăng đã xoá mềm',
        };
    } catch (error) {
        throw new Error('Lỗi khi đếm số bài đăng: ' + error.message);
    }
};


// Hàm bài đăng mới ngày hôm nay 
const getNewPostsToday = async () => {
    try {
        // Lấy ngày hôm nay
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày hôm nay

        const newPostsToday = await Post.count({
            where: {
                createdAt: {
                    [Op.gte]: today, // Bài đăng được tạo từ đầu ngày hôm nay trở đi
                },
                status: { [Op.ne]: 1 }, // Loại bỏ các bài đăng bị xóa
            },
        });

        return {
            success: true,
            newPostsToday: newPostsToday,
            message: 'Số bài đăng mới hôm nay',
        };
    } catch (error) {
        throw new Error('Lỗi khi đếm số bài đăng mới hôm nay: ' + error.message);
    }
};


// Hàm đếm tổng số danh mục
const getTotalCategories = async () => {
    try {
        const totalCategories = await Category.count({
           
        });

        return {
            success: true,
            total: totalCategories,
            message: 'Tổng số danh mục',
        };
    } catch (error) {
        throw new Error('Lỗi khi đếm số danh mục: ' + error.message);
    }
};

// Hàm đếm tổng số giao dịch thành công với transactionType là 'nạp tiền'
const getTotalSuccessfulTransactions = async () => {
    try {
        const totalSuccessfulTransactions = await Transaction.count({
            where: {
                status: 'thành công', // Loại giao dịch có status là "thành công"
                transactionType: 'nạp tiền', // Điều kiện transactionType là "nạp tiền"
            },
        });

        return {
            success: true,
            total: totalSuccessfulTransactions,
            message: 'Tổng số giao dịch thành công (nạp tiền)',
        };
    } catch (error) {
        throw new Error('Lỗi khi đếm số giao dịch thành công (nạp tiền): ' + error.message);
    }
};

// Hàm đếm số giao dịch thành công với transactionType là 'nạp tiền' trong ngày hôm nay
const getSuccessfulTransactionsToday = async () => {
    try {
        // Lấy ngày hôm nay
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày hôm nay

        const successfulTransactionsToday = await Transaction.count({
            where: {
                status: 'thành công', // Loại giao dịch có status là "thành công"
                transactionType: 'nạp tiền', // Điều kiện transactionType là "nạp tiền"
                createdAt: {
                    [Op.gte]: today, // Lọc các giao dịch có status "thành công" và transactionType "nạp tiền" được tạo từ đầu ngày hôm nay
                },
            },
        });

        return {
            success: true,
            successfulTransactionsToday: successfulTransactionsToday,
            message: 'Số giao dịch thành công hôm nay (nạp tiền)',
        };
    } catch (error) {
        throw new Error('Lỗi khi đếm số giao dịch thành công hôm nay (nạp tiền): ' + error.message);
    }
};
// Hàm đếm tổng số giao dịch thành công với transactionType là 'thanh toán'
const getTotalPaymentTransactions = async () => {
    try {
        const totalPaymentTransactions = await Transaction.count({
            where: {
                status: 'thành công', // Loại giao dịch có status là "thành công"
                transactionType: 'thanh toán', // Điều kiện transactionType là "thanh toán"
            },
        });

        return {
            success: true,
            total: totalPaymentTransactions,
            message: 'Tổng số giao dịch thanh toán thành công',
        };
    } catch (error) {
        throw new Error('Lỗi khi đếm số giao dịch thanh toán thành công: ' + error.message);
    }
};

// Hàm đếm số giao dịch thành công với transactionType là 'thanh toán' trong ngày hôm nay
const getPaymentTransactionsToday = async () => {
    try {
        // Lấy ngày hôm nay
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày hôm nay

        const paymentTransactionsToday = await Transaction.count({
            where: {
                status: 'thành công', // Loại giao dịch có status là "thành công"
                transactionType: 'thanh toán', // Điều kiện transactionType là "thanh toán"
                createdAt: {
                    [Op.gte]: today, // Lọc các giao dịch có status "thành công" và transactionType "thanh toán" được tạo từ đầu ngày hôm nay
                },
            },
        });

        return {
            success: true,
            paymentTransactionsToday: paymentTransactionsToday,
            message: 'Số giao dịch thanh toán thành công hôm nay',
        };
    } catch (error) {
        throw new Error('Lỗi khi đếm số giao dịch thanh toán thành công hôm nay: ' + error.message);
    }
};

module.exports = {
    getTotalUsers,
    getNewUsersToday,
    getTotalPosts,
    getTotalDeletePosts,
    getNewPostsToday,
    getTotalCategories,
    getTotalSuccessfulTransactions,
    getSuccessfulTransactionsToday,
    getTotalPaymentTransactions,
    getPaymentTransactionsToday,
};
