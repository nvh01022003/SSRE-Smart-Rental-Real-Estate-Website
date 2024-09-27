const express = require("express")
const authController = require("../controller/auth")
const middleware = require("../middleware/auth-email")
const validate = require("../middleware/validate/validateMailPhone")
const router = express.Router()
router.post("/register", validate.validateEmailPhone, middleware.createCodeVery, middleware.verifiedMail, authController.resgister)
router.post("/login", authController.login)
module.exports = router