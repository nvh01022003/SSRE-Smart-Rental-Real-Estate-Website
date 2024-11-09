const { User, Wallet, Transaction } = require('../../models');

// Hàm lấy tất cả lịch sử giao dịch
const TransactionHistory = async () => {
    try {
        const transactions = await Transaction.findAll({
            attributes: ['id', 'paycode', 'wallet_id', 'amount', 'status', 'createdAt'],
            include: [
                {
                    model: Wallet,
                    attributes: ['id'], // Lấy user_id từ Wallet
                    
                },
            ],
        });

        const result = transactions.map((transaction) => ({
            id: transaction.id,
            paycode: transaction.paycode,
            wallet_id: transaction.wallet_id,
            amount: transaction.amount,
            status: transaction.status,
            createdAt: transaction.createdAt
        }));

        return {
            err: 0,
            msg: 'get transaction history success',
            transactions: result,
        };
    } catch (err) {
        return {
            err: 1,
            msg: `Error retrieving transaction history: ${err.message}`,
        };
    }
};

module.exports = {
  TransactionHistory,
};
