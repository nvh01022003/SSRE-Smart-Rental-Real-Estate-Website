const { Role } = require("../../models/index");
const checkRoleUser = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const role = await Role.findOne({
            where: {
                user_id: userId
            }
        })
        if (role.type === 'ladnlord') {
            next();
        } else {
            return res.status(403).json({
                err: 1,
                msg: 'You are not ladnlord'
            })
        }
    } catch (err) {
        return res.status(500).json({
            err: 10,
            msg: err.message,
        });
    }
};
module.exports = { checkRoleUser };