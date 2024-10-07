const nodemailer = require("nodemailer")
const validator = require('validator');
const { where } = require("sequelize");
const readline = require('readline');

const cookieParser = require('cookie-parser');
const { VeriMail, User, sequelize } = require("../../models/index");
const { request } = require("http");
// gui code den email nguoi dung

const createCodeVery = async (req, res, next) => {

    const { firstName, lastName, phone, email, password } = req.body
    if (!firstName || !lastName || !phone || !email || !password) {

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
                // res.status(200).json({
                //     err: 0,
                //     msg: 'Verification code sent to email'
                // });

                // xoa code da luu sau 60s
                setTimeout(() => {
                    VeriMail.destroy({ where: { email } })
                }, 60000);

                // Trả về phản hồi cho FE
                res.status(200).json({
                    err: 0,
                    msg: 'Verification code sent to your email',
                });

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
    const codeMail = req.params.codeMail;
    console.log('Email:', email);
    console.log('CodeMail:', codeMail);
    console.log('Type of codeMail:', typeof email);
    console.log('Type of codeMail:', typeof codeMail);


    try {
        const resCode = await VeriMail.findOne({ where: { email } });
        console.log(resCode);
        console.log('Type of resCode.code:', typeof resCode.code);
        if (codeMail == resCode.code) {
            next();
        }
        else {
            res.status(400).send("Very email fail!")
        }
    } catch (err) {
        res.status(400).send("Very email fail!")
    }

}
module.exports = { createCodeVery, verifiedMail }