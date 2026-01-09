const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const verifyUser = require("../helpers/verifyUser");

const router = express.Router();

//Register a new user

router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      NIDNumber,
      phoneNumber,
      password,
      bloodGroup,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      NIDNumber,
      phoneNumber,
      bloodGroup,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Login user

router.post("/login", async (req, res) => {
  const { phoneNumber, password } = req.body;

  const user = await User.findOne({ phoneNumber });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, { httpOnly: true });
  res.json({ message: "Login successful" });
});

//User profile

router.get("/profile", verifyUser, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

//All users

router.get("/", verifyUser, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

//Update Single User

router.put("/:id", verifyUser, async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).select("-password");

  res.json(updatedUser);
});

//Delete User
router.delete("/:id", verifyUser, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
});

module.exports = router;
