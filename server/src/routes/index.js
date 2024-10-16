const authRouter = require("./auth")
const tenantsRouter = require("./tenants-routes")
const ladnlordRouter = require("./ladnlord-routes")
// client
const initRoutes = (app) => {
    app.use("/api/v1/auth", authRouter)
    app.use("/api/v1/user/tenants", tenantsRouter)
    app.use("/api/v1/user/ladnlord", ladnlordRouter)
    return app.use("/", (req, res) => {
        res.send("Running on localhost 5000")
    })
}
// admin
module.exports = initRoutes