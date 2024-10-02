const { User, sequelize } = require("../../models/index");
// check email va sdt da ton tai ch
const validateEmailPhone = async (req, res, next) => {

    const { email, numberPhone } = req.body;

    try {
        const [existingEmail, existingPhone] = await Promise.all([
            User.findOne({ where: { email } }),
            User.findOne({ where: { phone: numberPhone } }),
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

module.exports = { validateEmailPhone }