// services/roleService.js
const { Sequelize,Role,Post,Category,Transaction } = require('../../models'); // Điều chỉnh đường dẫn models
const { Op } = require('sequelize');
const { get } = require('../../routes/admin-routes');

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
const getDepositRevenue = async (year) => {
    try {
        const monthlyRevenues = [];

        // Lặp qua từng tháng trong năm (1 đến 12)
        for (let month = 1; month <= 12; month++) {
            let startDate = new Date(`${year}-${String(month).padStart(2, '0')}-01`);
            let endDate = new Date(`${year}-${String(month + 1).padStart(2, '0')}-01`);

            // Kiểm tra nếu tháng là 12 thì tháng sau sẽ là năm sau
            if (month === 12) {
                endDate = new Date(`${Number(year) + 1}-01-01`);
            }

            // Query tính tổng tiền nạp cho tháng hiện tại
            const result = await Transaction.findAll({
                attributes: [
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_deposit']
                ],
                where: {
                    transactionType: 'nạp tiền',
                    status: 'Thành công',
                    createdAt: {
                        [Op.gte]: startDate,
                        [Op.lt]: endDate,
                    },
                },
                raw: true,
            });

            // Lưu doanh thu của tháng vào mảng
            monthlyRevenues.push({
                month: month,
                total_deposit: result[0]?.total_deposit || 0, // Nếu không có giao dịch, gán bằng 0
            });
        }

        return {
            success: true,
            data: monthlyRevenues,
            message: 'Doanh thu của 12 tháng trong năm ' + year,
        };
    } catch (error) {
        console.error('Error in getDepositRevenue service:', error);
        throw error;
    }
};

// Hàm đếm số lượng tài khoản được tạo mới trong từng tháng của năm 
const getNewUsersByMonth = async (year) => {
    try {
        const monthlyUserCounts = [];

        // Lặp qua từng tháng trong năm (1 đến 12)
        for (let month = 1; month <= 12; month++) {
            let startDate = new Date(`${year}-${String(month).padStart(2, '0')}-01`);
            let endDate = new Date(`${year}-${String(month + 1).padStart(2, '0')}-01`);

            // Kiểm tra nếu tháng là 12 thì tháng sau sẽ là năm sau
            if (month === 12) {
                endDate = new Date(`${Number(year) + 1}-01-01`);
            }

            // Query tính số lượng tài khoản mới trong tháng hiện tại 
            const result = await Role.count({
                where: {
                    createdAt: {
                        [Op.gte]: startDate, // Ngày bắt đầu của tháng
                        [Op.lt]: endDate, // Ngày bắt đầu của tháng tiếp theo
                    },
                    type: {
                        [Op.ne]: 'admin', // Loại trừ tài khoản admin
                    },
                },
            });

            // Lưu số lượng tài khoản mới của tháng vào mảng
            monthlyUserCounts.push({
                month: month,
                newUsersCount: result || 0, // Nếu không có tài khoản nào, gán là 0
            });
        }

        return {
            success: true,
            data: monthlyUserCounts,
            message: 'Số lượng tài khoản mới được tạo trong năm ' + year,
        };
    } catch (error) {
        console.error('Error in getNewUsersByMonth service:', error);
        throw error;
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
    getDepositRevenue,
    getNewUsersByMonth
};
