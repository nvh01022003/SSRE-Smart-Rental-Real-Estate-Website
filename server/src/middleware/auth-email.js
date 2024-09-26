const nodemailer = require("nodemailer")
const validator = require('validator');
const { where } = require("sequelize");
const readline = require('readline');
const { VeriMail, User, sequelize } = require("../models/index");
const { error } = require("console");
// gui code den email nguoi dung
const createCodeVery = async (req, res, next) => {
    const { firstName, lastName, numberPhone, email, password } = req.body
    if (!firstName || !lastName || !numberPhone || !email || !password) {
        res.status(400).send("Enter all fields!")
    }
    else {
        // check email có hợp lệ không bằng thư viện validator
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                err: 1,
                msg: 'Invalid email format'
            });
        }
        else {
            // Tạo mã xác thực random
            // const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const verificationCode = "14042003"
            // config
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER, // Email send
                    pass: process.env.EMAIL_PASS, // pass mail
                },
            });
            // Cấu hình nội dung email
            let mailOptions = {
                from: process.env.EMAIL_USER, // Email người gửi
                to: email, // Email người nhận
                subject: `Chào ${firstName} Mã xác thực của bạn cho SSRE là:`,
                text: `Mã xác thực của bạn là: ${verificationCode}`,
            }
            try {
                // Gửi email
                await transporter.sendMail(mailOptions);
                // luu tam code db
                const newCode = await VeriMail.create({
                    email,
                    code: verificationCode
                });

                // Chuyển tiếp đến middleware hoặc xử lý tiếp theo
                next();
            } catch (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({
                    err: 1,
                    msg: 'Failed to send verification email',
                });
            }
        }
    }
}
// client nhập code mail để so sanh với code trong db
const verifiedMail = async (req, res, next) => {
    const { email } = req.body
    // tao code fake de test nek
    const codeEmail = sessionStorage.getItem('tempCode');
    const resCode = await VeriMail.findOne({ where: { email } });
    if (codeEmail == resCode.code) {
        next();
    }
    else {
        res.status(200).send("Very email fail!")
    }
}
// check email va sdt da ton tai ch
const validateEmailPhone = async (req, res, next) => {
    const { email, numberPhone } = req.body
    try {
        const existingEmail = await User.findOne({ where: { email } });
        const existingPhone = await User.findOne({ where: { phone: numberPhone } });
        if (existingEmail) {
            return res.status(200).json({
                err: 0,
                msg: 'Email already exists'
            });
        }
        else if (existingPhone) {
            return res.status(200).json({
                err: 0,
                msg: 'Phone number already exists'
            });
        }
        else
            next()
    }
    catch (err) {
        return res.status(400).json({
            err: 10,
            msg: err.message
        });
    }
}
module.exports = { createCodeVery, verifiedMail, validateEmailPhone }