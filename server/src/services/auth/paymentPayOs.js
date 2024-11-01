// src/services/payosService.js
//const PayOS = require('@payos/node');
const crypto = require('crypto');
const axios = require('axios');
const PayOS = require('@payos/node');
const { Transaction, Wallet } = require('../../models');
require('dotenv').config();

// Khởi tạo đối tượng PayOS với các thông tin từ biến môi trường
const payOS = new PayOS("3eec00e7-41bd-43cb-8fac-1dbe0fe0e71f",
    "884530fe-985f-4495-86e0-13e849f3a646",
    "a29b070b0effcc6cc78b3667150478ee996d74fb0216aef1d78cb07b65402aed");

// Tạo yêu cầu thanh toán qua payOS
const createPaymentPayos = async (amount, id) => {
    try {
        const orderCode = Number(String(new Date().getTime()).slice(-6));  // bởi vì payos yêu cầu mã đơn hàng phải là số

        const paymentData = {
            orderCode,
            amount,
            description: "Thanh toán qua PayOS",
            returnUrl: 'http://localhost:3000/he-thong/nap-tien', // Đảm bảo `returnUrl` được đặt đúng
            cancelUrl: 'http://localhost:3000/he-thong/nap-tien' // Đảm bảo `cancelUrl` được đặt đúng
        };
        console.log("Payment Data:", paymentData); // Kiểm tra giá trị của paymentData

        // Gửi yêu cầu tạo thanh toán đến payOS
        const response = await payOS.createPaymentLink(paymentData);


        console.log("Full PayOS Response:", response); // Kiểm tra toàn bộ phản hồi
        if (response && response.error) {
            console.error("PayOS API Error:", response.error);
            throw new Error(`PayOS API Error: ${response.error.message}`);
        }


        if (response && response.checkoutUrl) {
            // Lưu thông tin giao dịch vào DB
            await Transaction.create({
                wallet_id: id,
                paycode: orderCode,
                amount,
                status: 'Đang thanh toán bằng PayOS',
                created_at: new Date(),
                updated_at: new Date()
            });

            // Trả về URL thanh toán từ payOS
            return response.checkoutUrl;
        }

        throw new Error("Invalid PayOS response");
    } catch (error) {
        console.error("Error creating PayOS payment request:", error);
        throw new Error(error.message);
    }
};

// Kiểm tra trạng thái giao dịch qua payOS
const checkTransaction = async (orderId) => {
    try {
        const response = await payOS.getPaymentStatus(orderId);
        console.log("PayOS transaction status response:", response);

        return response;
    } catch (error) {
        console.error("Error checking transaction status:", error);
        throw new Error("Transaction status check failed");
    }
};

// Cập nhật số dư của ví sau khi giao dịch thành công
async function updateWallet(walletId, amount, orderCode) {
    const wallet = await Wallet.findOne({ where: { id: walletId } });

    if (wallet) {
        wallet.balance = parseFloat(wallet.balance) + parseFloat(amount);
        await wallet.save();

        // Cập nhật trạng thái giao dịch
        await Transaction.update(
            { status: 'Thanh toán PayOS thành công' },
            { where: { wallet_id: walletId, paycode: String(orderCode) } }
        );
    }
}

module.exports = { createPaymentPayos, checkTransaction, updateWallet };