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
