const asyncHandler = require("express-async-handler");
const User = require("../models/userModel")
const generateToken = require("../config/generateToken")



//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
     // console.log(keyword);
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  
  
  // except current  uset { _id: { $ne: req.user._id } } return all user that in keyword
  // but before search for user first auth it -> i need to check authorization for .find({ _id: { $ne: req.user._id } });this wuery
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  // const users = await User.find({ $and: [{ _id: { $ne: req.user._id } }, { keyword }] });
  res.send(users);
});


//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
    // res.status(400);
    // throw new Error("Please Enter all the Feilds");
  }

    
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      // res.status(400);
      // throw new Error("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "User not found" });
      // throw new Error("User not found");
    }
  }
  catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});


//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});


module.exports = { allUsers, registerUser , authUser};