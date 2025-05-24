require("dotenv").config()
const express = require("express")
const app = express();
const cookieParser = require("cookie-parser")
const {connectDB} = require("./lib/db")
const authRoutes = require("./routes/auth.route")
const messageRoutes = require("./routes/message.route")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
// console.log(process.env.JWT_SECRET)


app.use('/api/auth' , authRoutes)
app.use('/api/message' , messageRoutes)


app.listen(process.env.PORT , () => {
    console.log(`server is runnig on port ${process.env.PORT}`);
    connectDB()
})