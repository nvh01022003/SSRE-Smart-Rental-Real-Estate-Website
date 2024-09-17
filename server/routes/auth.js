const express = require("express")
const router = express.Router()
router.get("/login", (req, res) => {
    res.send("Le Van Tri")
})
module.exports = router