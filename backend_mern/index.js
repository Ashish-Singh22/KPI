const express = require("express")
const cors = require("cors")
require("dotenv").config()
const connectDB = require("./config/db")
const router = require("./routes")
const cookieParser = require('cookie-parser')


const app = express()
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))
app.use(express.json({limit : '10mb'}));
app.use(express.urlencoded({limit : '10mb',extended: true}));
app.use(cookieParser())


app.use("/api",router)

const PORT = 8080 || process.env.PORT

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Connected to DB")
        console.log("Server is running")
    })
})

