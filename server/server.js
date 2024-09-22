const express = require("express")
const dotenv = require("dotenv")
const connectData = require("./src/config/connect-db")
const cors = require("cors")
const initRoutes = require("./src/routes/index")
dotenv.config()
// connect database
// connectData()
const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL,
    method: ["POST", "GET", "PUT", "DELETE"]
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
initRoutes(app)
const port = process.env.PORT || 3333
app.listen(port, () => {
    console.log("Servers runs successfully!")
})
// 