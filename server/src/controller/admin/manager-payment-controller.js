// controllers/transactionController.js
const transactionService = require('../../services/admin/manager-payment');

// Controller để lấy tất cả lịch sử giao dịch của tất cả khách hàng
const AllTransactionHistory = async (req, res) => {
    try {
        const response = await transactionService.TransactionHistory();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at transaction controller: ' + error.message,
        });
    }
};

module.exports = {
    AllTransactionHistory,
};