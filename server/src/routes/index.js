const authRouter = require("./auth")
const userRouter = require("./user-routes")
// client
const initRoutes = (app) => {
    app.use("/api/v1/auth", authRouter)
    app.use("/api/v1/user", userRouter)
    return app.use("/", (req, res) => {
        res.send("oke server on!")
    })
}
// admin
module.exports = initRoutes