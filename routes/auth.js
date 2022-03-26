const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { userValidation } = require("../validation/userValidation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const { error } = userValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // check if email exists
  const emailExists = await User.findOne({ email: email });
  if (emailExists) {
    return res.status(400).json({ error: "Email existerar redan..." });
  }

  // Hashing
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = new User({
    email: email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
    res.header("auth-token", token).json({ token: token });
  } catch (err) {
    res.status(400).json({ error: "Nått gick snett..." });
  }
});

// Login
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const { error } = userValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // check if email exists
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(400).json({ error: "Email existerar inte..." });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({ error: "Lösenord är fel..." });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.header("auth-token", token).json({ token: token });
});

module.exports = router;
