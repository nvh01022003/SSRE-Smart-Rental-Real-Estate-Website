const { Transaction, Wallet, User } = require("../../models/index");

const getAllDepositHistory = async () => {
    try {
        const depositHistory = await Transaction.findAll({
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

module.exports = {
    getAllDepositHistory,
};