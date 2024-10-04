const express = require("express")
const tenantsController = require("../controller/user/tenants-controller")
const validate = require("../middleware/validate/validateMailPhone")
const authentication = require("../controller/auth/auth")
const router = express.Router()
// TENANTS
router.get("/showInfo", authentication.authenticateToken, tenantsController.showInfoUser)
router.post("/changeInfo", authentication.authenticateToken, validate.validateUpdate, tenantsController.changeInfo)
router.post("/savePost/:id", authentication.authenticateToken, tenantsController.savaPost)
router.post("/reportPost/:id", authentication.authenticateToken, tenantsController.reportPost)


module.exports = router