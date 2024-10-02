const authRouter = require("./auth")
// client
const initRoutes = (app) => {
    app.use("/api/v1/auth", authRouter)
    return app.use("/", (req, res) => {
        res.send("oke server on!")
    })
}
// admin
module.exports = initRoutes