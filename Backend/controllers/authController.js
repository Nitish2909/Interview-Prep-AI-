const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//@desc   Register a new user
//@routes  POST  /api/auth/register
//@access   Public
const registerUser = async (req, res) => {
  try {
    const { fullname, email, password, profileImageUrl } = req.body;

    // 1) check empty
    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "All Fields Are Required",
      });
    }

    // 2) Check user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User Already Exists",
      });
    }

    //3) hash password

    const hashedPassword = await bcrypt.hash(password, 10);
    // 4) create new  user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      profileImageUrl,
    });

    // 5) Send response with token
    res.status(201).json({
      message: "User Registered Successfully",

      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@desc    Login user
//@routes  POST  /api/auth/login
//@access   Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) check empty
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2) find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({
        message: "Invalid email and password",
      });
    }
    // 3) compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).json({
        message: "Invalid email and password",
      });
    }

    // 4) Return user data with  JWT
    res.status(201).json({
      message: "User LoggedIn Successfully",

      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@desc   Get user Profile
//@routes  GET  /api/auth/profile
//@access   Private (Requires JWT)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
