const express = require("express")
const tenantsController = require("../controller/user/tenants-controller")
const ladnlordController = require("../controller/user/ladnlord-controller")
const validate = require("../middleware/validate/validate-user")
const authentication = require("../controller/auth/auth")
const authorization = require("../middleware/authorize/check-role")
const img = require("../middleware/upload/uploadImg")
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router()


// create post
router.post("/createPost", authentication.authenticateToken, authorization.checkRoleUser, upload.array('imgPost', 10), img.checkFileTypeImg, img.updateImgs, ladnlordController.createPost)
// change status post
router.post("/changestatus/:id", authentication.authenticateToken, authorization.checkRoleUser, ladnlordController.updateStatusPost)
// update post by id
router.post("/updatePost/:id", authentication.authenticateToken, authorization.checkRoleUser, upload.array('images', 10), ladnlordController.updatePost)
// delete post by id
router.delete("/deletePost/:id", authentication.authenticateToken, authorization.checkRoleUser, ladnlordController.deletePost)
// show list post
router.get("/listPost", authentication.authenticateToken, authorization.checkRoleUser, ladnlordController.listPost)
// show list post by page pagination
router.get("/listPostByPage", authentication.authenticateToken, authorization.checkRoleUser, ladnlordController.listPostByPage)
// change status posts 
router.post("/changestatus", authentication.authenticateToken, authorization.checkRoleUser, ladnlordController.updateStatusPosts)
// delete list post
router.delete("/deleteListPost", authentication.authenticateToken, authorization.checkRoleUser, ladnlordController.deleteListPost)
// show soft delete list post
router.get("/listPostSoftDelete", authentication.authenticateToken, authorization.checkRoleUser, ladnlordController.showAllSoftDeletePosts)
// restore post
router.put("/restorePost/:id", authentication.authenticateToken, authorization.checkRoleUser, ladnlordController.restorePost)
// soft delete post
router.put("/softDeletePost/:id", authentication.authenticateToken, authorization.checkRoleUser, ladnlordController.softDeletePost)
// extend post gia hạn bài đăng 
router.post("/extendPost", authentication.authenticateToken, authorization.checkRoleUser, ladnlordController.extendPost)

module.exports = router