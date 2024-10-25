const { createPaymentRequest, updateWalletBalance, checkTransactionStatus } = require("../../services/auth/paymentService"); // Import service
const { Wallet, Transaction } = require('../../models'); // Import model Wallet

// Tạo yêu cầu thanh toán
const createPayment = async (req, res) => {
    const { amount, id } = req.body;

    try {
        // Kiểm tra ví
        const wallet = await Wallet.findOne({ where: { id: id } });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        const orderId = "MOMO" + new Date().getTime(); // Mã đơn hàng (unique)

        // Tạo yêu cầu thanh toán và nhận URL từ MoMo
        const paymentUrl = await createPaymentRequest(amount, orderId, id);

        // Trả về URL để người dùng thực hiện thanh toán
        return res.status(200).json({ payUrl: paymentUrl, orderId: orderId, message: 'Payment request created, please proceed with the payment' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};




// const checkPaymentStatus = async (req, res) => {
//     const { orderId } = req.body;

//     try {
//         // Kiểm tra trạng thái giao dịch từ MoMo
//         const statusResponse = await checkTransactionStatus(orderId);

//         // Trả về kết quả trạng thái
//         return res.status(200).json(statusResponse);
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

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





// Xử lý callback từ MoMo khi giao dịch hoàn thành
// const momoCallback = async (req, res) => {
//     console.log('------Callback data:', req.body);
//     const { orderId, amount, id, resultCode } = req.body;
//     try {
//         if (resultCode === 0) {
//             // Cập nhật số dư ví sau khi thanh toán thành công
//             await updateWalletBalance(id, amount);

//             // Cập nhật trạng thái giao dịch trong DB
//             await Transaction.update(
//                 { status: 'success' },
//                 { where: { paycode: orderId } }
//             );

//             console.log('Updated Wallet:', await Wallet.findOne({ where: { id: id } }));

//             return res.status(200).json({ message: 'Transaction successful, wallet updated' });
//         } else {
//             // Nếu giao dịch không thành công
//             await Transaction.update(
//                 { status: 'failed' },
//                 { where: { paycode: orderId } }
//             );
//             return res.status(400).json({ message: 'Transaction failed or canceled' });
//         }
//     } catch (error) {
//         return res.status(500).json({ message: 'Failed to update wallet balance', error: error.message });
//     }
// };



module.exports = { createPayment, checkPaymentStatus }; 
