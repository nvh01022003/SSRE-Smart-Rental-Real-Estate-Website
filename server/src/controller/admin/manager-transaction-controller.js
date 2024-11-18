const transactionService = require('../../services/admin/manager-transaction'); // Adjust the path to your service file

const showAllDepositHistory = async (req, res) => {
    try {
        const depositHistory = await transactionService.getAllDepositHistory();
        res.status(200).json(depositHistory);
    } catch (error) {
        console.error('Error fetching deposit history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const showAllHistoryPayment = async (req, res) => {
    try {
        const historyPayment = await transactionService.getAllHistoryPayment();
        res.status(200).json(historyPayment);
    } catch (error) {
        console.error('Error fetching history payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    showAllDepositHistory,
    showAllHistoryPayment,
};