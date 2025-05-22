const express = require("express")
const app = express();
require("dotenv").config()
const authRoutes = require("./routes/auth.route")

app.use('/api/auth' , authRoutes)


app.listen(process.env.PORT , () => {
    console.log(`server is runnig on port ${process.env.PORT}`);
})