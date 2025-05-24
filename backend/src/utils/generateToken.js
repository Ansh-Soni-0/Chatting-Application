const jwt = require("jsonwebtoken")

const generateToken = (userId , res) => {
    const token = jwt.sign({userId} , process.env.JWT_SECRET , {
        expiresIn:"7d"
    })
    res.cookie("token" , token , {
        maxAge: 7*24*60*60*1000, //7 days in ms
        httpOnly: true, //prevend XSS attack cross-site scriptioon attack
        saneSite: "Strict",//prevend CSRF attack cross-site request forgery attack
        secure: process.env.NODE_ENV !== "development"
    })

    return token
}

module.exports = { generateToken }