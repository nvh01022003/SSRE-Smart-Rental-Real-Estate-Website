const bcryptjs = require("bcryptjs");
const gravatar = require("gravatar");
const { where } = require("sequelize");
const { User, sequelize } = require("../models/index");
// RESGISTER 
const registerService = async ({ firstName, lastName, numberPhone, email, password }) => {
    try {
        // Tạo chuỗi salt để mã hóa mật khẩu
        const salt = bcryptjs.genSaltSync(10);
        // Mã hóa mật khẩu
        const hashPass = bcryptjs.hashSync(password, salt);
        console.log('Hashed password:', hashPass);
        // Tạo avatar mặc định sử dụng email
        const avtDefaul = gravatar.url(email);
        // Tạo người dùng mới trong cơ sở dữ liệu
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            pass: hashPass,
            phone: numberPhone,
            img_avt: avtDefaul
        });

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
    console.log(password)
    const user = await User.findOne({
        where: {
            email,
        }
    })
    if (user) {
        const checkPass = bcryptjs.compareSync(password, user.pass);
        if (checkPass) {
            return {
                err: 0,
                msg: 'Login success'
            };
        }
        else {
            return {
                err: 1,
                msg: error.message
            };
        }
    }
    else {
        return {
            msg: 'Email not exits'
        };
    }
};
module.exports = { registerService, loginService };
