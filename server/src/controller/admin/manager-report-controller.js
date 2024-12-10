// controllers/roleController.js
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

// Thống kê tổng số  thanh toán thành công
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
    getPaymentTransactionsToday
    
   
};

