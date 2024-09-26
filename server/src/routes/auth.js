const express = require("express")
const authController = require("../controller/auth")
const middleware = require("../middleware/auth-email")
const router = express.Router()
router.post("/register", middleware.validateEmailPhone, middleware.createCodeVery, middleware.verifiedMail, authController.resgister)
router.post("/login", authController.login)
module.exports = router