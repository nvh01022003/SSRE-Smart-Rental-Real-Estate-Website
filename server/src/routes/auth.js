const express = require("express")
const authController = require("../controller/auth/auth")
const middleware = require("../middleware/auth/auth-email")
const validate = require("../middleware/validate/validate-user")
const validateEmpty = require("../middleware/validate/check-empty")
const tenantsController = require("../controller/user/tenants-controller")
const authentication = require("../controller/auth/auth")
const img = require("../middleware/upload/uploadImg")
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router()
router.post("/validatemail", validate.validateEmailPhone, validateEmpty.checkEmptyUser, middleware.createCodeVery)
router.post("/register/:codeMail", middleware.verifiedMail, authController.resgister)
router.post("/login", authController.login)
// change password
router.post("/changePass", authentication.authenticateToken, validate.validatePass, authController.changePass)
// reset password
router.post("/codeChangePass", validate.validateEmailPhoneReset, middleware.createCodeVery)
router.post("/resetPass/:codeMail", middleware.verifiedMail, authController.resetPass)
router.post('/upload', authentication.authenticateToken, upload.single('avatar'), img.checkFileType, img.updateImg, tenantsController.changeInfo);
module.exports = router