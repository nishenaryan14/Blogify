// routes/auth.js
const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/authController");

// Registration endpoint
router.post("/register", authController.register);

// Login endpoint
router.post("/login", passport.authenticate("local"), authController.login);

// Logout endpoint
router.get("/logout", authController.logout);

router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});
module.exports = router;
