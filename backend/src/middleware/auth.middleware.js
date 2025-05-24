const jwt = require("jsonwebtoken")


const User = require("../models/user.model")

const protectRoute = async (req , res , next) => {
    try {
        const token = req.cookies.token
        if(!token) return res.status(401).json({success:false , message:"Unauthorized - No Token Provided"})

        const decoded = jwt.verify(token , process.env.JWT_SECRET)

        if(!decoded) return res.status(401).json({success:false , message:"Unauthorized - Invalid Token"})

        const user = await User.findById(decoded.userId).select("-password")

        if(!user) return res.status(404).json({success:false , message:"User not found"})

        req.user = user

        next()

    } catch (error) {
        console.log("Error in protectRoute middleware" , error.message)
        return res.status(500).json({success:false , message:"Internal server error"})
    }
}

module.exports = { protectRoute }