const { User, sequelize } = require("../../models/index");
const authServices = require("../../services/auth/auth");
const bcryptjs = require("bcryptjs");

// check email va sdt da ton tai ch
const validateEmailPhone = async (req, res, next) => {
    const { email, phone } = req.body;

    try {
        const [existingEmail, existingPhone] = await Promise.all([
            User.findOne({ where: { email } }),
            User.findOne({ where: { phone } }),
        ]);

        if (existingEmail) {
            return res.status(409).json({ // 409 xung đột là một mã
                err: 1,
                msg: 'Email already exists',
            });
        } else if (existingPhone) {
            return res.status(409).json({ // 409 xung đột là một mã
                err: 2,
                msg: 'Phone number already exists',
            });
        } else {
            next();
        }
    } catch (err) {
        return res.status(500).json({
            err: 10,
            msg: err.message,
        });
    }
};
// check email va sdt da ton tai ch khi reset pass
const validateEmailPhoneReset = async (req, res, next) => {
    const { email } = req.body;
    const recCheck = await User.findOne({ where: { email } });
    if (recCheck) {
        next();
    } else {
        return res.status(404).json({
            err: 1,
            msg: 'Email not found in the system',
        });
    }
}

const { Op } = require('sequelize'); //Operators trong sequelize, thêm toán tử logic và so sánh id user

const validateUpdate = async (req, res, next) => {
    const { id, email, phone } = req.body;

    try {
        // Check if email is duplicate for other users
        const existingEmail = await User.findOne({ where: { email, id: { [Op.ne]: id } } }); // Loại trừ ID của user hiện tại bằng Op.ne
        if (existingEmail) {
            return res.status(409).json({
                err: 1,
                msg: 'Email already exists',
            });
        }

        // Check if phone is duplicate for other users
        const existingPhone = await User.findOne({ where: { phone, id: { [Op.ne]: id } } }); // Loại trừ ID của user hiện tại bằng Op.ne
        if (existingPhone) {
            return res.status(409).json({
                err: 2,
                msg: 'Phone number already exists',
            });
        }

        // If no conflicts, proceed to the next middleware
        next();
    } catch (err) {
        return res.status(500).json({
            err: 10,
            msg: err.message,
        });
    }
};

module.exports = validateUpdate;

const validatePass = async (req, res, next) => {
    const { oldPass, newPass } = req.body;
    const userId = req.user.id
    const user = await User.findOne({ where: { id: userId } });
    const checkPass = bcryptjs.compareSync(oldPass, user.pass);
    if (checkPass) {
        if (newPass.length >= 6)
            next();
        else {
            return res.status(400).json({
                err: 1,
                msg: 'Password from 6 characters'
            });
        }
    } else {
        return res.status(400).json({
            err: 2,
            msg: 'Password is incorrect'
        });
    }

};
module.exports = { validateEmailPhone, validateUpdate, validatePass, validateEmailPhoneReset }