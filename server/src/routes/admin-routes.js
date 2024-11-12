const express = require("express")
const tenantsController = require("../controller/user/tenants-controller")
const ladnlordController = require("../controller/user/ladnlord-controller")
const validate = require("../middleware/validate/validate-user")
const validateCategory = require("../middleware/validate/check-category-exits.js")
const authentication = require("../controller/auth/auth")
const authorization = require("../middleware/authorize/check-role")
const managerUserController = require("../controller/admin/manager-user-controller")
const managerCategoryController = require("../controller/admin/manager-category-controller.js")
const managerPostController = require("../controller/admin/manager-post-controller.js")
const managerPaymentController = require("../controller/admin/manager-payment-controller.js")
const img = require("../middleware/upload/uploadImg")
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router()
module.exports = router


// MANAGE USER
// show all user
router.get("/showAllUser", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.showAllUser)
// delete user by select list id ( sử dụng cho phần chọn nhiều id sau đó xóa)
router.delete("/deleteUsers", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.deleteUsers)
// show detail user by id
router.get("/showDetailUser/:userId", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.showDetailUser)
// update user by id
router.put("/updateUser/:userId", authentication.authenticateToken, authorization.checkRoleAdmin, validate.validateUpdateUserByAdmin, managerUserController.updateUser)
// delete user by id
router.delete("/deleteUser/:userId", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.deleteUser, managerUserController.sendMailReasonDeleteUser)
// find user by name
router.get("/findUserByName", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.findUserByEmail)
// find user by role
router.get("/findUserByRole", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.findUserByRole)

// MANAGE UPGRADE REQUEST
// hiển thị các yêu cầu nâng cấp tài khoản
router.get("/showAllUpgradeRequest", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.showAllUpgradeRequest)

// phê duyệt yêu cầu nâng cấp tài khoản
// change role user by id
router.put("/changeRoleUser/:userId", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.changeRoleUser, managerUserController.sendMailApproveUpgradeRequest)
// từ chối yêu cầu nâng cấp tài khoản
router.put("/rejectUpgradeRequest/:userId", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.rejectUpgradeRequest, managerUserController.sendMailRejectUpgradeRequest)


// MANAGE CATEGORY
// show all category
router.get("/showAllCategory", authentication.authenticateToken, authorization.checkRoleAdmin, managerCategoryController.showAllCategory)
// create category
// check lại 
router.post("/createCategory", authentication.authenticateToken, authorization.checkRoleAdmin, validateCategory.checkCategoryExits, managerCategoryController.createCategory)
// update category by id
router.put("/updateCategory/:categoryId", authentication.authenticateToken, authorization.checkRoleAdmin, validateCategory.checkCategoryExits, managerCategoryController.updateCategory)
// delete category by id
router.delete("/deleteCategory/:categoryId", authentication.authenticateToken, authorization.checkRoleAdmin, managerCategoryController.deleteCategory)



// MANAGE POST
// show all post in system
router.get("/showAllPost", authentication.authenticateToken, authorization.checkRoleAdmin, managerPostController.showAllPost)
// delete post by select list id ( sử dụng cho phần chọn nhiều id sau đó xóa)
router.delete("/deletePosts", authentication.authenticateToken, authorization.checkRoleAdmin, managerPostController.deletePosts)
// show detail post by id
router.get("/showDetailPost/:postId", authentication.authenticateToken, authorization.checkRoleAdmin, managerPostController.showDetailPost)
// delete post by id
router.delete("/deletePost/:postId", authentication.authenticateToken, authorization.checkRoleAdmin, managerPostController.deletePost)
// soft delete post by id (chuyển trạng thái thành 1)
router.put("/softDeletePost/:postId", authentication.authenticateToken, authorization.checkRoleAdmin, managerPostController.softDeletePost)
// soft delete post by select list id ( sử dụng cho phần chọn nhiều id sau đó xóa)
router.put("/softDeletePosts", authentication.authenticateToken, authorization.checkRoleAdmin, managerPostController.softDeletePosts)
// show all soft Delete Posts
router.get("/showAllSoftDeletePosts", authentication.authenticateToken, authorization.checkRoleAdmin, managerPostController.showAllSoftDeletePosts)
// restore post by id (chuyển trạng thái từ 1 thành 0)
router.put("/restorePost/:postId", authentication.authenticateToken, authorization.checkRoleAdmin, managerPostController.restorePost)


//MANAGE PAYMENT
router.get("/showAllTransaction", authentication.authenticateToken, managerPaymentController.AllTransactionHistory)

// MANAGE TYPE POST
// create type post
router.post("/createTypePost", authentication.authenticateToken, authorization.checkRoleAdmin, managerPostController.createTypePost)
// update type post by id
router.put("/updateTypePost/:typePostId", authentication.authenticateToken, authorization.checkRoleAdmin, managerPostController.updateTypePost)
// delete type post by id
router.delete("/deleteTypePost/:typePostId", authentication.authenticateToken, authorization.checkRoleAdmin, managerPostController.deleteTypePost)
// show all type post có pagination
router.get("/showAllTypePost", authentication.authenticateToken, managerPostController.showAllTypePost)