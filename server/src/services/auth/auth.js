const bcryptjs = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");

const { where } = require("sequelize");
const { User, Role, sequelize } = require("../../models/index");
const { response } = require("express");

require('dotenv').config();
// MÃ HÓA MẬT KHẨU
const hashPassWord = (password) => {
    const salt = bcryptjs.genSaltSync(10);
    return bcryptjs.hashSync(password, salt);
}

// RESGISTER 
const registerService = async ({ firstName, lastName, phone, email, password }) => {
    try {
        const hashPass = await hashPassWord(password);
        console.log('Hashed password:', hashPass);
        // Tạo avatar mặc định sử dụng email
        const avtDefaul = gravatar.url(email);
        // Tạo người dùng mới trong cơ sở dữ liệu
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            pass: hashPass,
            phone,
            img_avt: avtDefaul
        });
        await Role.create({ user_id: newUser.id, type: 'tenants' });

        // Trả về người dùng mới
        return {
            err: 0,
            msg: 'User registered successfully',
            user: newUser
        };

    } catch (error) {
        // Xử lý lỗi
        return {
            err: 1,
            msg: error.message || "Error registering user"
        };
    }
}
// LOGIN taht
const loginService = async ({ email, password }) => {
    const user = await User.findOne({
        where: { email }
    });

    if (user) {
        const checkPass = bcryptjs.compareSync(password, user.pass);
        const token = checkPass ? jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '5d' }) : null;

        if (checkPass) {
            return {
                err: 0,
                msg: 'Login success',
                access_token: token,
            };
        } else {
            return {
                err: 1,
                msg: 'Email hoặc mật khẩu không đúng !' // Trả về thông báo lỗi nếu mật khẩu sai
            };
        }
    } else {
        return {
            err: 1,
            msg: 'Email hoặc mật khẩu không đúng !' // Trả về thông báo lỗi nếu email không tồn tại
        };
    }
};

// change password
const changePassWord = async (userId, password) => {
    try {

        const hashPass = await hashPassWord(password);
        await User.update({ pass: hashPass }, { where: { id: userId } })
        return {
            err: 0,
            msg: 'Change password success'
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        }
    }
}

// reset password
const resetPassWord = async (email, newPass) => {

    try {
        const hashPass = await hashPassWord(newPass);
        await User.update({ pass: hashPass }, { where: { email } })
        return {
            err: 0,
            msg: 'Reset password success'
        }
    } catch (err) {
        return {
            err: 1,
            msg: err
        }
    }
}
module.exports = { registerService, loginService, hashPassWord, changePassWord, resetPassWord };

