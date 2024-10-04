const express = require("express")
const authController = require("../controller/auth/auth")
const middleware = require("../middleware/auth/auth-email")
const validate = require("../middleware/validate/validateMailPhone")
const tenantsController = require("../controller/user/tenants-controller")
const authentication = require("../controller/auth/auth")
const img = require("../middleware/upload/uploadImg")
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router()

router.post("/validatemail", validate.validateEmailPhone, middleware.createCodeVery)
router.post("/register/:codeMail", middleware.verifiedMail, authController.register)
router.post("/login", authController.login)
router.post('/upload', authentication.authenticateToken, upload.single('avatar'), img.checkFileType, img.updateImg, tenantsController.changeInfo);
module.exports = router