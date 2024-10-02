const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const initRoutes = require("./src/routes/index")
const cookieParser = require('cookie-parser');

dotenv.config()
const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL,
    method: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}))
app.use(cookieParser());
app.use(express.json())

app.use(express.urlencoded({ extended: true }))
initRoutes(app)
const port = process.env.PORT || 3333
app.listen(port, () => {
    console.log("Servers runs successfully!")
})
// 