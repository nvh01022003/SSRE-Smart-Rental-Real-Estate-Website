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
// TENANTS
// show info user
router.get("/showInfo", authentication.authenticateToken, tenantsController.showInfoUser)
// change info user
router.post("/changeInfo", authentication.authenticateToken, validate.validateUpdate, tenantsController.changeInfo)
// save post
router.post("/savePost/:id", authentication.authenticateToken, tenantsController.savaPost)
// report post
router.post("/reportPost/:id", authentication.authenticateToken, tenantsController.reportPost)
// show list post saved ( favorite )
router.get("/listPostSaved", authentication.authenticateToken, tenantsController.listPostSaved)
// find post by price
router.get("/findPostByPrice", authentication.authenticateToken, tenantsController.findPostByPrice)
// find post by location
router.get("/findPostByLocation", authentication.authenticateToken, tenantsController.findPostByLocation)



// LADNLORD
// create post
router.post("/createPost", authentication.authenticateToken, authorization.checkRoleUser, upload.array('imgPost', 10), img.checkFileTypePost, img.updateImgs, ladnlordController.createPost)
// change status post
router.post("/changestatus/:id", authentication.authenticateToken, authorization.checkRoleUser, ladnlordController.updateStatusPost)
// update post
router.get("/updatePost/:id", authentication.authenticateToken, authorization.checkRoleUser, ladnlordController.updatePost)
// delete post
router.delete("/deletePost/:id", authentication.authenticateToken, authorization.checkRoleUser, ladnlordController.deletePost)
module.exports = router