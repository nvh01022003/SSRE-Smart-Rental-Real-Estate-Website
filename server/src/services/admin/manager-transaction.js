const { Transaction, Wallet, User } = require("../../models/index");

const getAllDepositHistory = async () => {
    try {
        const depositHistory = await Transaction.findAll({
            where: {
                transactionType: 'nạp tiền'
            },
            include: [
                {
                    model: Wallet,
                    attributes: ['user_id'],
                    include: [
                        {
                            model: User,
                            attributes: ['firstName', 'lastName', 'email', 'phone', 'img_avt']
                        }
                    ]
                }
            ]
        });

        return {
            err: 0,
            msg: 'Deposit history fetched successfully',
            depositHistory
        };
    } catch (error) {
        console.error('Error fetching deposit history:', error);
        throw new Error('Internal server error');
    }
};

const getAllHistoryPayment = async () => {
    try {
        const historyPayment = await Transaction.findAll({
            where: {
                transactionType: 'thanh toán',
            },
            include: [
                {
                    model: Wallet,
                    attributes: ['user_id'],
                    include: [
                        {
                            model: User,
                            attributes: ['firstName', 'lastName', 'email', 'phone', 'img_avt']
                        }
                    ]
                }
            ]
        });

        return {
            err: 0,
            msg: 'History payment fetched successfully',
            historyPayment
        };
    } catch (error) {
        console.error('Error fetching history payment:', error);
        throw new Error('Internal server error');
    }
};

module.exports = {
    getAllDepositHistory,
    getAllHistoryPayment,
};