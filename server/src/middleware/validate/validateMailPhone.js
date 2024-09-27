const { User, sequelize } = require("../../models/index");
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
module.exports = { validateEmailPhone }