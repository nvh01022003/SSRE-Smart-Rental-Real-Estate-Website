const statisticsService = require('../../services/admin/manager-report');

// Thống kê tổng số người dùng (trừ admin)
const getTotalUsers = async (req, res) => {
    try {
        const response = await statisticsService.getTotalUsers();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at statistics controller getTotalUsers: ' + error,
        });
    }
};

// Thống kê số người dùng mới trong ngày hôm nay 
const getNewUsersToday = async (req, res) => {
    try {
        const response = await statisticsService.getNewUsersToday();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at statistics controller getNewUsersToday: ' + error,
        });
    }
};

// Thống kê tổng số bài đăng
const getTotalPosts = async (req, res) => {
    try {
        const response = await statisticsService.getTotalPosts();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at statistics controller getTotalPosts: ' + error,
        });
    }
};
//Thống kê tổng ôố bài đăng xoá mềm 
const getTotalDeletePosts = async (req, res) => {
    try {
        const response = await statisticsService.getTotalDeletePosts();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at statistics controller getTotalDeletePosts: ' + error,
        });
    }
};
//Thống kê bài đăng mới trong ngày hôm nay
const getNewPostsToday = async (req, res) => {
    try {
        const response = await statisticsService.getNewPostsToday();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at statistics controller getNewPostsToday: ' + error,
        });
    }
};
// Thống kê tổng số danh mục 
const getTotalCategories = async (req, res) => {
    try {
        const response = await statisticsService.getTotalCategories();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at statistics controller getTotalCategories: ' + error,
        });
    }
};
// Thống kê tổng số loại tin 
const getTotalPostType = async (req, res) => {
    try {
        const response = await statisticsService.getTotalPostType();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at statistics controller getTotalPostType: ' + error,
        });
    }
};
// Tổng số giao dịch thành công nạp tiền
const getTotalTransactions = async (req, res) => {
    try {
        const response = await statisticsService.getTotalSuccessfulTransactions();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at statistics controller getTotalTransactions: ' + error,
        });
    }
};
// Tổng số giao dịch nạp tiền  thành công hôm nay
const getTotalSuccessTransactionsToday = async (req, res) => {
    try {
        const response = await statisticsService.getSuccessfulTransactionsToday();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at statistics controller getTotalSuccessTransactionsToday: ' + error,
        });
    }
};

// Thống kê tổng số giao dịch thanh toán
const getTotalPaymentTransactions = async (req, res) => {
    try {
        const response = await statisticsService.getTotalPaymentTransactions();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at statistics controller getTotalPaymentTransactions: ' + error,
        });
    }
};

// Thống kê tổng số giao dịch nạp tiền
const getTotalDepositTransactions = async (req, res) => {
    try {
        const response = await statisticsService.getTotalDepositTransactions();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at statistics controller getTotalDepositTransactions: ' + error,
        });
    }
};

// Thống kê số  thanh toán thành công hôm nay
const getPaymentTransactionsToday = async (req, res) => {
    try {
        const response = await statisticsService.getPaymentTransactionsToday();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at statistics controller getPaymentTransactionsToday: ' + error,
        });
    }
};

const getDepositRevenueByTime = async (req, res) => {
    try {
        const { year, month } = req.query;
        console.log("Year:", year, "Month:", month);
        // Kiểm tra input
        if (!year) {
            return res.status(400).json({ message: "Year is required" });

        }

        // Gọi service để lấy tổng tiền nạp
        const totalDeposit = await statisticsService.getDepositRevenue(year, month);

        return res.status(200).json({
            year,
            month: month || null,
            totalDeposit,
        });
    } catch (error) {
        console.error('Error in getDepositRevenueByTime controller:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
// Controller để lấy số lượng tài khoản mới theo tháng trong năm
const getNewUsersByMonth = async (req, res) => {
    try {
        const { year } = req.query; // Lấy năm từ URL param, ví dụ: /new-users/:year
        console.log("Year:", year);

        // Gọi service để lấy số lượng tài khoản mới theo từng tháng trong năm
        const result = await statisticsService.getNewUsersByMonth(year);

        if (result.success) {
            return res.status(200).json(result); // Trả về kết quả thành công
        } else {
            return res.status(400).json({
                success: false,
                message: 'Không thể lấy số lượng tài khoản mới theo tháng.',
            });
        }
    } catch (error) {
        console.error('Error in getNewUsersByMonth controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xử lý yêu cầu.',
            error: error.message,
        });
    }
};
// Controller đếm số bài viết mới theo tháng trong năm
const getNewPostsByMonth = async (req, res) => {
    try {
        const { year } = req.query; // Lấy năm từ query parameter

        // Kiểm tra nếu không có năm
        if (!year) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp năm cần thống kê.',
            });
        }

        // Gọi service để lấy dữ liệu
        const result = await statisticsService.getNewPostsByMonth(year);

        // Trả về dữ liệu
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in getNewPostsByMonth controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xử lý yêu cầu.',
            error: error.message,
        });
    }
};
const getTotalUpgradeLandlord = async (req, res) => {
    try {
        const response = await statisticsService.getTotalUpgradeLandlord();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at statistics controller getTotalUsers: ' + error,
        });
    }
};
module.exports = {
    getTotalUsers,
    getNewUsersToday,
    getTotalPosts,
    getTotalDeletePosts,
    getNewPostsToday,
    getTotalCategories,
    getTotalTransactions,
    getTotalSuccessTransactionsToday,
    getTotalPaymentTransactions,
    getPaymentTransactionsToday,
    getDepositRevenueByTime,
    getNewUsersByMonth,
    getNewPostsByMonth,
    getTotalUpgradeLandlord,
    getTotalDepositTransactions,
    getTotalPostType
};

