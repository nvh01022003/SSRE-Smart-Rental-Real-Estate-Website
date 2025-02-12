const { createPaymentRequest, updateWalletBalance, checkTransactionStatus } = require("../../services/auth/paymentService"); // Import service
const { createPaymentPayos, updateWallet, checkTransaction } = require("../../services/auth/paymentPayOs"); // Import service

const { Wallet, Transaction } = require('../../models'); // Import model Wallet

// Tạo yêu cầu thanh toán
const createPayment = async (req, res) => {
    const { paymentMethod } = req.body; // Thêm `paymentMethod` để xác định MoMo hoặc PayOS
    const amount = parseInt(req.body.amount);
    const userId = req.user.id;
    console.log('Amount:', amount, 'User ID:', userId, 'Payment Method:', paymentMethod);

    try {
        // Kiểm tra ví của người dùng
        const wallet = await Wallet.findOne({ where: { user_id: userId }, attributes: ['id'] });
        if (!wallet) {
            console.log('Wallet not found for user ID:', userId);
            return res.status(404).json({ message: 'Wallet not found' });
        }

        // Tạo mã đơn hàng với tiền tố để phân biệt MoMo hoặc PayOS
        const orderId = (paymentMethod === "MoMo" ? "MOMO" : "PAYOS") + new Date().getTime();

        // Gọi dịch vụ thanh toán phù hợp dựa trên `paymentMethod`
        let paymentUrl;
        if (paymentMethod === "MoMo") {
            paymentUrl = await createPaymentRequest(amount, orderId, wallet.id); // Gọi MoMo service
        } else if (paymentMethod === "payOS") {
            paymentUrl = await createPaymentPayos(amount, wallet.id); // Gọi PayOS service
        } else {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        // Trả về URL thanh toán cho người dùng
        return res.status(200).json({ payUrl: paymentUrl, message: 'Payment request created, please proceed with the payment' });
    } catch (error) {
        console.error('Error creating payment request:', error.message);
        return res.status(500).json({ message: error.message });
    }
};



// dự phòng kiểm tra trạng thái thanh toán
const checkPaymentStatus = async (req, res) => {
    const { orderId } = req.body;

    try {
        // Kiểm tra trạng thái giao dịch từ MoMo
        const statusResponse = await checkTransactionStatus(orderId);

        // Kiểm tra nếu giao dịch thành công (resultCode = 0)
        if (statusResponse.resultCode === 0) {
            // Tìm giao dịch trong database (hoặc tìm theo thông tin liên quan đến ví nếu cần)
            const transaction = await Transaction.findOne({ where: { paycode: orderId } });

            if (transaction) {
                // Cập nhật số dư của ví tương ứng
                await updateWalletBalance(transaction.wallet_id, statusResponse.amount);

                return res.status(200).json({
                    message: 'Transaction successful, wallet balance updated.',
                    transaction: statusResponse
                });
            } else {
                return res.status(404).json({ message: 'Transaction not found in database.' });
            }
        } else {
            return res.status(400).json({
                message: `Transaction failed with resultCode: ${statusResponse.resultCode}`,
                transaction: statusResponse
            });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const handleMoMoCallback = async (req, res) => {
    // Nhận dữ liệu từ MoMo
    console.log("MoMo callback response:", req.body);

    const { orderId, message, resultCode, amount } = req.body; // Lấy dữ liệu cần thiết

    // Kiểm tra xem giao dịch có thành công không
    if (resultCode === 0) {
        console.log(`Transaction successful: ${orderId}`);

        // Tìm giao dịch trong database
        const transaction = await Transaction.findOne({ where: { paycode: orderId } });

        if (transaction) {
            // Cập nhật số dư của ví tương ứng
            await updateWalletBalance(transaction.wallet_id, amount, orderId);

            console.log(`Wallet balance updated for wallet_id: ${transaction.wallet_id}, amount: ${amount}`);
            return res.status(200).send("OK"); // Gửi phản hồi về cho MoMo
        } else {
            console.log("Transaction not found in database.");
            return res.status(404).json({ message: 'Transaction not found in database.' });
        }
    } else {
        // Giao dịch không thành công
        console.log("Transaction failed:", message);
        return res.status(400).json({
            message: `Transaction failed with resultCode: ${resultCode}`,
            error: message
        });
    }
};

// Xử lý callback từ PayOS khi giao dịch hoàn thành
const handlePayOSCallback = async (req, res) => {
    console.log("PayOS callback response:", req.body);

    const { code, desc, data } = req.body;
    // Kiểm tra nếu giao dịch thành công
    if (code === '00') {
        const { orderCode, amount } = data;
        const transaction = await Transaction.findOne({ where: { paycode: orderCode } });

        if (transaction) {
            // Cập nhật số dư của ví tương ứng bằng hàm `updateWallet`
            await updateWallet(transaction.wallet_id, amount, orderCode);
            console.log(`Wallet balance updated for wallet_id: ${transaction.wallet_id}, amount: ${amount} (PayOS)`);
            return res.status(200).send("OK"); // Phản hồi thành công về cho PayOS
        } else {
            console.log("Transaction not found in database.");
            return res.status(404).json({ message: 'Transaction not found in database.' });
        }
    } else {
        // Xử lý nếu giao dịch thất bại
        console.log("Transaction failed:", message);
        return res.status(400).json({
            message: `Transaction failed with resultCode: ${resultCode}`,
            error: message
        });
    }
};


const showBalance = async (req, res) => {
    const userId = req.user.id;
    try {
        const wallet = await Wallet.findOne({ where: { user_id: userId }, attributes: ['balance'] });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        return (
            res.status(200).json({
                err: 0,
                msg: 'get balance success',
                balance: wallet.balance
            })
        )
    } catch (error) {
        return res.status(500).json(error);
    }
};

const showDepositHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the wallet associated with the user
        const wallet = await Wallet.findOne({ where: { user_id: userId } });

        if (!wallet) {
            return res.status(404).json({ err: 1, msg: 'Wallet not found' });
        }

        // Find transactions associated with the wallet
        const transactions = await Transaction.findAll({
            where: {
                wallet_id: wallet.id,
                transactionType: 'nạp tiền'
            },
            attributes: ['paycode', 'createdAt', 'amount', 'status']
        });

        return res.status(200).json({ err: 0, transactions });
    } catch (error) {
        console.error('Error fetching deposit history:', error);
        return res.status(500).json({ err: 1, msg: 'Internal server error' });
    }
};

const showHistoryPayment = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the wallet associated with the user
        const wallet = await Wallet.findOne({ where: { user_id: userId } });

        if (!wallet) {
            return res.status(404).json({ err: 1, msg: 'Wallet not found' });
        }

        // Find transactions associated with the wallet
        const transactions = await Transaction.findAll({
            where: {
                wallet_id: wallet.id,
                transactionType: 'thanh toán'
            },
            attributes: ['paycode', 'createdAt', 'amount', 'status', 'content', 'balanceAfterTransaction']
        });

        return res.status(200).json({ err: 0, transactions });
    } catch (error) {
        console.error('Error fetching history payment:', error);
        return res.status(500).json({ err: 1, msg: 'Internal server error' });
    }
};

module.exports = { showHistoryPayment, showDepositHistory, createPayment, checkPaymentStatus, handleMoMoCallback, handlePayOSCallback, showBalance }; 