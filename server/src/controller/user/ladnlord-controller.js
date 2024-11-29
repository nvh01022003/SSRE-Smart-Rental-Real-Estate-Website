const user = require("../../models/user");
const ladnlordServices = require("../../services/user-service/ladnlord-services")
const createPost = async (req, res) => {
    try {
        const imageUrls = req.body.imageUrls; // URL của các ảnh đã upload
        console.log('imageUrls', imageUrls)
        const contentPost = req.body.contentPost;
        const response = await ladnlordServices.createNewPost(req.user.id, contentPost, imageUrls);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
};

// UPDATE STATUS POST BY ID
const updateStatusPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const status = req.body.status;
        const response = await ladnlordServices.updateStatusPost(postId, status);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
};

// UPATE STATUS POSTS
const updateStatusPosts = async (req, res) => {
    try {
        const postIds = req.body.postIds;
        const status = req.body.status;
        const response = await ladnlordServices.updateStatusPosts(postIds, status);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// UPATE POST
const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log('postId', postId);
        const dataUpdate = JSON.parse(req.body.post);
        console.log('dataUpdate', dataUpdate);
        const files = req.files; // Get the uploaded files
        console.log('files', files);

        const response = await ladnlordServices.updatePost(postId, dataUpdate, files);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// DELETE POST
const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log('postId', postId)
        const response = await ladnlordServices.deletePost(postId);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// DELETE LIST POST BY LIST ID POST
const deleteListPost = async (req, res) => {
    try {
        const postIds = req.body.postIds;
        const response = await ladnlordServices.deleteListPost(postIds);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
// LIST POST
const listPost = async (req, res) => {
    try {
        userId = req.user.id;
        const response = await ladnlordServices.listPost(userId);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
// SHOW LIST POST BY PAGE PAGINATION
const listPostByPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const userId = req.user.id
        const response = await ladnlordServices.listPostByPage(userId, page);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
// LIST POST
const showAllSoftDeletePosts = async (req, res) => {
    try {
        userId = req.user.id;
        const response = await ladnlordServices.showAllSoftDeletePosts(userId);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
// restorePostController.js
const restorePost = async (req, res) => {
    try {

        const postId = req.params.id; // Lấy postId từ tham số URL

        // Gọi service để khôi phục bài đăng
        const response = await ladnlordServices.restoreSoftDeletedPost(postId);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


// softDeletePostController.js
const softDeletePost = async (req, res) => {
    try {
        const postId = req.params.id; // Lấy postId từ tham số URL

        // Gọi service để xóa mềm bài đăng
        const response = await ladnlordServices.softDeletePost(postId);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
// GIA Hạn Bài Đăng 
const extendPost = async (req, res) => {
    try {
        const { postId, newExpireDate, totalPayment, newPostTypeId } = req.body; // Lấy dữ liệu từ body request
        // Gọi service gia hạn bài đăng
        const response = await postServices.extendPost(req.user.id, postId, newExpireDate, totalPayment, newPostTypeId); 
        return res.status(200).json(response); // Trả về phản hồi cho client
    } catch (error) {
        return res.status(400).json({ error: error.message }); // Trả về lỗi nếu có
    }
};


module.exports = {
    createPost,
    updateStatusPost,
    updatePost,
    deletePost,
    deleteListPost,
    listPost,
    updateStatusPosts,
    listPostByPage,
    showAllSoftDeletePosts,
    restorePost,
    softDeletePost,
    extendPost


}
