

const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userControllers");
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// protect is auth middleware before search for the user
router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);

module.exports = router; 