const { Role } = require("../../models/index");
// check role user landnlord
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
const checkRoleUserTenants = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const role = await Role.findOne({
            where: {
                user_id: userId
            }
        })
        if (role.type === 'tenants') {
            next();
        } else {
            return res.status(403).json({
                err: 1,
                msg: 'You are not tenant'
            })
        }
    } catch (err) {
        return res.status(500).json({
            err: 10,
            msg: err.message,
        });
    }
};
// show thong tin role
const showRoleDetail = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const role = await Role.findOne({
            where: {
                user_id: userId
            }
        })
        return res.status(200).json({
            err: 0,
            msg: role.type
        })
    } catch (err) {
        return res.status(500).json({
            err: 10,
            msg: err.message,
        });
    }
}
// check role admin
const checkRoleAdmin = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const role = await Role.findOne({
            where: {
                user_id: userId
            }
        })
        if (role.type === 'admin') {
            next();
        } else {
            return res.status(403).json({
                err: 1,
                msg: 'You are not admin'
            })
        }
    } catch (err) {
        return res.status(500).json({
            err: 10,
            msg: err.message,
        });
    }
};
module.exports = { checkRoleUser, checkRoleUserTenants, showRoleDetail, checkRoleAdmin };