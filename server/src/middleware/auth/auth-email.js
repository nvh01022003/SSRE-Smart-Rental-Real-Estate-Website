const nodemailer = require("nodemailer")
const validator = require('validator');
const { where } = require("sequelize");
const readline = require('readline');
const cookieParser = require('cookie-parser');
const { VeriMail, User, sequelize } = require("../../models/index");
const { request } = require("http");
// gui code den email nguoi dung
const createCodeVery = async (req, res, next) => {
    const { email } = req.body
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
            subject: `Mã xác thực của bạn cho SSRE là:`,
            html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4caf50; color: white; padding: 16px; text-align: center;">
            <h1>SSRE Verification Code</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Xin chào,</p>
            <p>Chúng tôi nhận được yêu cầu xác thực email của bạn. Vui lòng sử dụng mã xác nhận dưới đây để tiếp tục:</p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; background-color: #f3f3f3; color: #333; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 8px; border: 1px dashed #ccc;">
                    ${verificationCode}
                </span>
            </div>
            <p style="color: #555;">Lưu ý: Mã xác nhận này sẽ hết hạn sau 60 giây.</p>
            <p>Trân trọng,<br/>Đội ngũ SSRE</p>
        </div>
        <div style="background-color: #f3f3f3; text-align: center; padding: 10px; font-size: 12px; color: #777;">
            <p>Đây là email tự động, vui lòng không trả lời.</p>
            <p>&copy; 2024 SSRE, All rights reserved.</p>
        </div>
    </div>
    `,
        }
        try {
            // Gửi email
            await transporter.sendMail(mailOptions);
            // luu tam code db
            const newCode = await VeriMail.create({
                email,
                code: verificationCode
            });
            res.status(200).json({
                err: 0,
                msg: 'Verification code sent to email'
            });
            // xoa code da luu sau 60s
            setTimeout(() => {
                VeriMail.destroy({ where: { email } })
            }, 60000);
        } catch (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({
                err: 1,
                msg: 'Failed to send verification email',
            });
        }
    }
}
// client nhập code mail để so sanh với code trong db
const verifiedMail = async (req, res, next) => {
    const { email } = req.body
    console.log(email)
    const codeMail = req.params.codeMail;
    console.log(codeMail)
    try {
        const resCode = await VeriMail.findOne({ where: { email } });
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