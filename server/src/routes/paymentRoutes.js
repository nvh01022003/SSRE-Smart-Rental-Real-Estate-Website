const express = require('express');
const crypto = require('crypto');
const paymentController = require('../controller/user/paymentController'); // Import controller
const authentication = require("../controller/auth/auth")
const authorization = require("../middleware/authorize/check-role")
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/payment',authentication.authenticateToken, paymentController.createPayment);  // Route để tạo yêu cầu thanh toán
router.get('/showBalance',authentication.authenticateToken, paymentController.showBalance );
//router.post('/callback', paymentController.momoCallback);  // Route để xử lý callback từ MoMo
router.post(('/check-payment-status'), paymentController.checkPaymentStatus);  // Route để kiểm tra trạng thái thanh toán
router.post(('/callback'), paymentController.handleMoMoCallback);  // Route để kiểm tra trạng thái thanh toán
module.exports = router;
