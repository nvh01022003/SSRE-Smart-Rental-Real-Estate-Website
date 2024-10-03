const express = require("express")
const tenantsController = require("../controller/user/tenants-controller")
const authentication = require("../controller/auth/auth")
const router = express.Router()
// TENANTS
router.get("/showInfo", authentication.authenticateToken, tenantsController.showInfoUser)
router.get("/changeInfo", authentication.authenticateToken, tenantsController.changeInfo)
module.exports = router