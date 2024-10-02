const nodemailer = require("nodemailer")
const validator = require('validator');
const { where } = require("sequelize");
const readline = require('readline');
const { User, VeriMail, sequelize } = require("../models/index");
const createCodeVery = async (req, res, next) => {
    const { firstName, lastName, numberPhone, email, password } = req.body
    console.log('ok')
    console.log(req.body)

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
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            //const verificationCode = "14042003"
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
                subject: 'Mã xác thực của bạn cho SSRE là:',
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
                // xoa code da luu sau 60s
                setTimeout(() => {
                    VeriMail.destroy({ where: { email } })
                }, 60000);

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
const verifiedMail = async (req, res, next) => {
    const { email, verificationCode } = req.body
    // tao code fake de test nek
    //const codeEmail = "140420023"
    const resCode = await VeriMail.findOne({ where: { email } });
    if (verificationCode == resCode.code) {
        next();
    }
    else {
        res.status(400).send("Very email fail!")
    }
}

module.exports = { createCodeVery, verifiedMail }