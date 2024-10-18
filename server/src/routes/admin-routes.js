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
router.get("/showAllUser", managerUserController.showAllUser)
// delete user by select list id ( sử dụng cho phần chọn nhiều id sau đó xóa)
router.delete("/deleteUsers", managerUserController.deleteUsers)
// show detail user by id
router.get("/showDetailUser/:userId", managerUserController.showDetailUser)
// update user by id
router.put("/updateUser/:userId", managerUserController.updateUser)
// change role user by id
router.put("/changeRoleUser/:userId", managerUserController.changeRoleUser)
// delete user by id
router.delete("/deleteUser/:userId", managerUserController.deleteUser)
// find user by name
router.get("/findUserByName", managerUserController.findUserByEmail)
// find user by role
router.get("/findUserByRole", managerUserController.findUserByRole)



// MANAGE CATEGORY
// show all category
router.get("/showAllCategory", managerCategoryController.showAllCategory)
// create category
router.post("/createCategory", validateCategory.checkCategoryExits, managerCategoryController.createCategory)
// update category by id
router.put("/updateCategory/:categoryId", validateCategory.checkCategoryExits, managerCategoryController.updateCategory)
// delete category by id
router.delete("/deleteCategory/:categoryId", managerCategoryController.deleteCategory)

// MANAGE POST
// show all post in system
router.get("/showAllPost", managerPostController.showAllPost)
module.exports = router