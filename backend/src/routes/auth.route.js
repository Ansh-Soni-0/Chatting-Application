const express = require("express")
const router = express.Router()
const upload = require("../middleware/multer")

const {
    signup,
    login,
    logout,
    updateProfile,
    checkAuth
} = require("../controllers/auth.controller")

const { protectRoute } = require("../middleware/auth.middleware")


router.post("/signup" , signup)
router.post("/login"  , login )
router.post("/logout" , logout)

router.put("/update-profile" , protectRoute , upload.single("profilePic") , updateProfile)

router.get("/check" , protectRoute , checkAuth)



module.exports = router