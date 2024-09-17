const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
dotenv.config()
const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL,
    method: ["POST", "GET", "PUT", "DELETE"]
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/", (req, res) => { res.send("server on...") })
const port = process.env.PORT || 3333
app.listen(port, () => {
    console.log("Servers is running")
})