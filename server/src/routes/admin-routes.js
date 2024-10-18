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
const img = require("../middleware/upload/uploadImg")
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router()


// MANAGE USER
// show all user
router.get("/showAllUser", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.showAllUser)
// delete user by select list id ( sử dụng cho phần chọn nhiều id sau đó xóa)
router.delete("/deleteUsers", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.deleteUsers)
// show detail user by id
router.get("/showDetailUser/:userId", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.showDetailUser)
// update user by id
router.put("/updateUser/:userId", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.updateUser)
// change role user by id
router.put("/changeRoleUser/:userId", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.changeRoleUser)
// delete user by id
router.delete("/deleteUser/:userId", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.deleteUser)
// find user by name
router.get("/findUserByName", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.findUserByEmail)
// find user by role
router.get("/findUserByRole", authentication.authenticateToken, authorization.checkRoleAdmin, managerUserController.findUserByRole)




// MANAGE CATEGORY
// show all category
router.get("/showAllCategory", authentication.authenticateToken, authorization.checkRoleAdmin, managerCategoryController.showAllCategory)
// create category
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
module.exports = router