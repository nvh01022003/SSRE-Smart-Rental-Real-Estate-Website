const user = require("../../models/user");
const managerUser = require("../../services/admin/manager-user")


// show all user
const showAllUser = async (req, res) => {
    try {
        const response = await managerUser.showAllUser()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showAllUser: ' + error
        })
    }
}
// show detail user by id
const showDetailUser = async (req, res) => {
    const userId = req.params.userId
    try {
        const response = await managerUser.showDetailUser(userId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showDetailUser: ' + error
        })
    }
}
// update user by id
const updateUser = async (req, res) => {
    const userId = req.params.userId
    const data = req.body
    console.log('data', data)
    try {
        const response = await managerUser.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller updateUser: ' + error
        })
    }
}


// Gửi mail khi xóa tài khoản
const nodemailer = require("nodemailer")

const sendMailReasonDeleteUser = async (req, res) => {
    const { email, reasonDeleteUser } = req.body;
    const { userData } = req.body; // Lấy thông tin từ middleware xóa người dùng

    // Thiết lập transporter và cấu hình nội dung email
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Tài khoản của bạn trên trang web Smart Rental Real Estate đã bị xóa !`,
        text: `Lí do: ${reasonDeleteUser}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            err: 0,
            msg: userData.msg, // Phản hồi từ deleteUser
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
            err: 1,
            msg: 'Failed to send content of reason for delete account to email',
        });
    }
};

// Gửi mail khi phê duyệt yêu cầu nâng cấp tài khoản
const sendMailApproveUpgradeRequest = async (req, res) => {
    const { email } = req.body;
    const { userData } = req.body; // Lấy thông tin từ middleware phê duyệt yêu cầu nâng cấp tài khoản

    console.log('email', email);
    console.log('userData', userData);

    // Thiết lập transporter và cấu hình nội dung email
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Phê duyệt thành công !`,
        text: `Xin chào bạn, chúng tôi đã phê duyệt yêu cầu nâng cấp tài khoản của bạn thành công.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            err: 0,
            msg: userData.msg, // Phản hồi từ changRoleUser
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
            err: 1,
            msg: 'Failed to send successful approvation to email',
        });
    }
}

// change role user by id
const changeRoleUser = async (req, res, next) => {
    const userId = req.params.userId
    try {
        const response = await managerUser.changeRoleUser(userId)
        if (response.err === 0) {
            req.body.userData = response; // Lưu thông tin vào req.body
            next(); // Chuyển sang middleware gửi email
        } else {
            return res.status(500).json(response); // Trả về lỗi nếu phê duyệt thất bại
        }
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller changeRoleUser: ' + error
        })
    }
}

const rejectUpgradeRequest = async (req, res, next) => {
    const userId = req.params.userId
    console.log('userId', userId);
    try {
        const response = await managerUser.rejectUpgradeRequest(userId)
        if (response.err === 0) {
            req.body.userData = response; // Lưu thông tin vào req.body
            next(); // Chuyển sang middleware gửi email
        } else {
            return res.status(500).json(response); // Trả về lỗi nếu phê duyệt thất bại
        }
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller rejectUpgradeRequest: ' + error
        })
    }
}


const sendMailRejectUpgradeRequest = async (req, res) => {
    const { email, reasonRejectUpgradeRequest } = req.body;
    console.log('email', email);
    console.log('reasonRejectUpgradeRequest', reasonRejectUpgradeRequest);
    const { userData } = req.body; // Lấy thông tin từ middleware từ chối yêu cầu nâng cấp tài khoản

    // Thiết lập transporter và cấu hình nội dung email
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Yêu cầu nâng cấp tài khoản của bạn trên trang web Smart Rental Real Estate đã bị từ chối !`,
        text: `Lí do: ${reasonRejectUpgradeRequest}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            err: 0,
            msg: userData.msg, // Phản hồi từ rejectUpgradeRequest
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
            err: 1,
            msg: 'Failed to send reject upgrade request to email !',
        });
    }
};

// delete user by id
const deleteUser = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const response = await managerUser.deleteUser(userId);
        if (response.err === 0) {
            req.body.userData = response; // Lưu thông tin xóa thành công vào req.body
            next(); // Chuyển sang middleware gửi email
        } else {
            return res.status(500).json(response); // Trả về lỗi nếu xóa thất bại
        }
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at deleteUser middleware: ' + error,
        });
    }
};

// delete user by select list id
const deleteUsers = async (req, res) => {
    const listId = req.body.listId
    try {
        const response = await managerUser.deleteUsers(listId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller deleteUsers: ' + error
        })
    }
}
// find user by email
const findUserByEmail = async (req, res) => {
    const email = req.body.email
    try {
        const response = await managerUser.findUserByEmail(email)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller findUserByEmail: ' + error
        })
    }
}
// find user by role
const findUserByRole = async (req, res) => {
    const role = req.body.role
    try {
        const response = await managerUser.findUserByRole(role)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller findUserByRole: ' + error
        })
    }
}
// show all upgrade request
const showAllUpgradeRequest = async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const response = await managerUser.showAllUpgradeRequest(page)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showAllUpgradeRequest: ' + error
        })
    }
}





module.exports = {
    showAllUser,
    showDetailUser,
    updateUser,
    changeRoleUser,
    sendMailReasonDeleteUser,
    deleteUser,
    deleteUsers,
    findUserByEmail,
    findUserByRole,
    showAllUpgradeRequest,
    sendMailApproveUpgradeRequest,
    rejectUpgradeRequest,
    sendMailRejectUpgradeRequest
}
