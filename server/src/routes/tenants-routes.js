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


// show info user
router.get("/showInfo", authentication.authenticateToken, tenantsController.showInfoUser)
// change info user
router.post("/changeInfo", authentication.authenticateToken, validate.validateUpdate, tenantsController.changeInfo)
// save post
router.post("/savePost/:id", authentication.authenticateToken, tenantsController.savaPost)
// show list post saved ( favorite )
router.get("/listPostSaved", authentication.authenticateToken, tenantsController.listPostSaved)
// delete list post saved
router.delete("/deletePostSaved/:id", authentication.authenticateToken, tenantsController.deletePostSaved)
// report post
router.post("/reportPost/:id", authentication.authenticateToken, tenantsController.reportPost)
// find post by price and acreage and location and category 
router.get("/findPostByAll", tenantsController.findPostByAll)
// show detail post
router.get("/showDetailPost/:id", tenantsController.showDetailPost)
// gửi yêu cầu nâng cấp tài khoản thành landlord và có up ảnh chứng minh nhân dân và đợi phê duyệt
// router.post("reqUpdateToLandlord", authentication.authenticateToken, upload.array('imgKYC', 2), img.checkFileTypeImg, img.updateImgs, tenantsController.reqUpdateToLandlord)




module.exports = router
