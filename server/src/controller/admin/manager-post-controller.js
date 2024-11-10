const managerPost = require('../../services/admin/manager-post')
// show all post in system
const showAllPost = async (req, res) => {
    try {
        const response = await managerPost.showAllPost()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showAllPost: ' + error
        })
    }
}
// delete post by select list id ( sử dụng cho phần chọn nhiều id sau đó xóa)
const deletePosts = async (req, res) => {
    const listId = req.body.listId
    try {
        const response = await managerPost.deletePosts(listId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller deletePosts: ' + error
        })
    }
}
// show detail post by id
const showDetailPost = async (req, res) => {
    const postId = req.params.postId
    try {
        const response = await managerPost.showDetailPost(postId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller showDetailPost: ' + error
        })
    }
}

// Gửi mail khi xóa bài viết
const nodemailer = require("nodemailer")

const sendMailReasonDeletePost = async (req, res) => {
    const postId = req.params.postId;
    const { email, reasonDeletePost } = req.body;
    const { postData } = req.body;

    // Thiết lập transporter và mailOptions như bình thường
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
        subject: `Bài đăng có mã tin ${postId} trên trang web Smart Rental Real Estate của bạn đã bị xóa!`,
        text: `Lí do: ${reasonDeletePost}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        // Trả về response cuối cùng khi hoàn thành cả xóa và gửi email
        return res.status(200).json({
            err: 0,
            posts: postData.posts,
            msg: `Post with ID ${postId} deleted and email sent successfully`,
        });
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: `Failed to send content of reason for delete post with id ${postId} to email`,
        });
    }
};

// delete post by id
// Xóa bài viết
const deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const response = await managerPost.deletePost(postId);
        if (response.err === 0) {
            // Tiếp tục với middleware tiếp theo (gửi mail) nếu xóa thành công
            req.body.postData = response; // Truyền dữ liệu xóa thành công qua req.body
            next();
        } else {
            // Nếu có lỗi khi xóa, trả về lỗi ngay lập tức
            return res.status(500).json(response);
        }
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at deletePost: ' + error,
        });
    }
};
// tạo loại bài đăng
const createTypePost = async (req, res) => {
    const { name, price } = req.body;
    try {
        const response = await managerPost.createTypePost(name, price);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at createTypePost: ' + error,
        });
    }
};
// update type post by id
const updateTypePost = async (req, res) => {
    const typePostId = req.params.typePostId;
    const { name, price } = req.body;
    try {
        const response = await managerPost.updateTypePost(typePostId, name, price);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at updateTypePost: ' + error,
        });
    }
};
//  delete type post by id
const deleteTypePost = async (req, res) => {
    const typePostId = req.params.typePostId;
    try {
        const response = await managerPost.deleteTypePost(typePostId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at deleteTypePost: ' + error,
        });
    }
};
// show all type post
const showAllTypePost = async (req, res) => {
    try {
        const response = await managerPost.showAllTypePost();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at showAllTypePost: ' + error,
        });
    }
};
module.exports = {
    showAllPost,
    deletePosts,
    showDetailPost,
    deletePost,
    sendMailReasonDeletePost,
    createTypePost,
    updateTypePost,
    deleteTypePost,
    showAllTypePost
}
