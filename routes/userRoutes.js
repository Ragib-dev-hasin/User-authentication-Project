const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const verifyUser = require("../helpers/verifyUser");

const router = express.Router();
