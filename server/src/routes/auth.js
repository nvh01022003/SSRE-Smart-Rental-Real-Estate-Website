const express = require("express")
const authController = require("../controller/auth")
const middleware = require("../middleware/auth-email")
const validate = require("../middleware/validate/validateMailPhone")
const router = express.Router()
router.post("/validatemail", validate.validateEmailPhone, middleware.createCodeVery)
router.post("/register/:codeMail", middleware.verifiedMail, authController.resgister)
router.post("/login", authController.login)
module.exports = router