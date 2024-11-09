const authRouter = require("./auth")
const tenantsRouter = require("./tenants-routes")
const ladnlordRouter = require("./ladnlord-routes")
const adminRouter = require("./admin-routes")
const paymentRouter = require("./paymentRoutes")
const aichatRouter = require("./ai-chat-routes")
// client
const initRoutes = (app) => {
    app.use("/api/v1/auth", authRouter)
    app.use("/api/v1/user/tenants", tenantsRouter)
    app.use("/api/v1/user/tenants/chatbot", aichatRouter)
    app.use("/api/v1/user/ladnlord", ladnlordRouter)
    app.use("/api/v1/admin", adminRouter)
    app.use("/api/v1/user", paymentRouter)
    return app.use("/", (req, res) => {
        res.send("Running on localhost 5000")
    })
}
// admin
module.exports = initRoutes