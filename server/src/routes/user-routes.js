const express = require("express")
const tenantsController = require("../controller/user/tenants-controller")

const validate = require("../middleware/validate/validate-user")

const authentication = require("../controller/auth/auth")
const authorization = require("../middleware/authorize/check-role")
const router = express.Router()
// TENANTS
// show info user
router.get("/showInfo", authentication.authenticateToken, tenantsController.showInfoUser)
// change info user

router.post("/changeInfo", authentication.authenticateToken, tenantsController.changeInfo)
//, validate.validateUpdate

// save post
router.post("/savePost/:id", authentication.authenticateToken, tenantsController.savaPost)
// report post
router.post("/reportPost/:id", authentication.authenticateToken, tenantsController.reportPost)

// LADNLORD
// create post
router.post("/createPost", authentication.authenticateToken, authorization.checkRoleUser, tenantsController.createPost)


module.exports = router