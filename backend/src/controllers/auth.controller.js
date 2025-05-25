const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const cloudinary = require("../lib/cloudinary");

const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    //check password
    if (password.length < 6)
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters",
        });

    //do not register with same email of more then one tym
    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Email already exist, please login" });

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //generate jwt token
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        success: "true",
        message: "account created successfully",
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.log("error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(500)
        .json({ success: false, message: "something missing" });

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({
          success: false,
          message: "Account Does not exist please create and account",
        });

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword)
      return res
        .status(400)
        .json({ success: false, message: "invalid credentials" });

    generateToken(user._id, res);

    return res
      .status(200)
      .json({
        success: true,
        message: "welcome back",
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      });
  } catch (error) {
    console.log("error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic)
      return res
        .status(400)
        .json({ success: true, message: "Profile picture is required" });

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
};
