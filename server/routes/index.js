const authRouter = require("./auth")
const initRoutes = (app) => {
    app.use("/api/v1/auth", authRouter)
    return app.use("/", (req, res) => {
        res.send("oke server on!")
    })
}
module.exports = initRoutes