// src/services/paymentService.js
const axios = require('axios');
const crypto = require('crypto');
const { Transaction, Wallet } = require('../../models');  // Import models

const createPaymentRequest = async (amount, orderId, id) => {
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var partnerCode = 'MOMO';
    const apiUrl = "https://test-payment.momo.vn/v2/gateway/api"; // Định nghĩa apiUrl
    var requestType = "payWithMethod";
    const requestId = orderId;
    const orderInfo = "Thanh toán với MoMo";
    const redirectUrl = "https://webhook.site/redirect/success";
    const ipnUrl = "https://9bd4-113-174-174-63.ngrok-free.app/api/v1/user/callback";

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    const requestBody = {
        partnerCode,
        partnerName: "MoMo Test",
        storeId: "MomoTestStore",
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang: 'vi',
        requestType,
        extraData: '',
        signature: signature
    };

    try {
        const response = await axios.post(`${apiUrl}/create`, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("MoMo response:", response.data);

        if (response.data && response.data.payUrl) {
            // Lưu giao dịch vào DB
            await Transaction.create({
                wallet_id: id,
                paycode: orderId,  // hoặc sử dụng một mã code trả về từ MoMo
                created_at: new Date(),
                updated_at: new Date()
            });

            // Trả về URL thanh toán MoMo
            return response.data.payUrl;
        }

        throw new Error("MoMo response invalid");
    } catch (error) {
        console.error("Error creating payment request:", error);
        throw new Error("Payment request failed");
    }
};

const checkTransactionStatus = async (orderId) => {
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var partnerCode = 'MOMO';
    const apiUrl = "https://test-payment.momo.vn/v2/gateway/api"; // Định nghĩa apiUrl
    const requestId = orderId;

    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;
    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = {
        accessKey,
        partnerCode,
        requestId,
        orderId,
        signature,
        lang: 'vi'
    };

    try {
        // Gửi request kiểm tra trạng thái giao dịch
        const response = await axios.post(`https://test-payment.momo.vn/v2/gateway/api/query`, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("MoMo transaction status response:", response.data);

        // Trả về dữ liệu phản hồi từ MoMo
        return response.data;
    } catch (error) {
        console.error("Error checking transaction status:", error);
        throw new Error("Transaction status check failed");
    }
};


// Cập nhật số dư của ví
async function updateWalletBalance(id, amount) {

    const wallet = await Wallet.findOne({ where: { id: id } });

    if (wallet) {
        wallet.balance = parseFloat(wallet.balance) + parseFloat(amount);
        await wallet.save();

    }


}





module.exports = { createPaymentRequest, updateWalletBalance, checkTransactionStatus };
