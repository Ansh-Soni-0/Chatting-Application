require("dotenv").config()
const express = require("express")
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors")
const {connectDB} = require("./lib/db")
const authRoutes = require("./routes/auth.route")
const messageRoutes = require("./routes/message.route")


const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}; 

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/api/auth' , authRoutes)
app.use('/api/message' , messageRoutes)



app.listen(process.env.PORT , () => {
    console.log(`server is runnig on port ${process.env.PORT}`);
    connectDB()
})