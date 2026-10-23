const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../models/User");
const Candidate = require("../models/Candidate");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();
const TOKEN_SECRET = () => process.env.AUTH_TOKEN_SECRET || process.env.MONGODB_URI;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashPassword(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) return reject(error);
      resolve(derivedKey.toString("hex"));
    });
  });
}

function createToken(user) {
  if (!TOKEN_SECRET()) throw new Error("AUTH_TOKEN_SECRET is not configured.");
  const payload = Buffer.from(JSON.stringify({
    userId: String(user._id),
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
  })).toString("base64url");
  const signature = crypto.createHmac("sha256", TOKEN_SECRET()).update(payload).digest("base64url");
  return payload + "." + signature;
}

function publicUser(user) {
  return { id: String(user._id), name: user.name, email: user.email };
}

router.post("/signup", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (name.length < 2 || name.length > 80) {
      return res.status(400).json({ status: "error", message: "Name must be between 2 and 80 characters." });
    }
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return res.status(400).json({ status: "error", message: "Enter a valid email address." });
    }
    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ status: "error", message: "Password must be at least 8 characters." });
    }
    if (await User.findOne({ email })) {
      return res.status(409).json({ status: "error", message: "An account with this email already exists. Please sign in." });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = await hashPassword(password, salt);
    const user = await User.create({ name, email, passwordHash, passwordSalt: salt });
    return res.status(201).json({ status: "success", token: createToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ status: "error", message: "An account with this email already exists. Please sign in." });
    }
    console.error("Signup error:", error.message);
    return res.status(500).json({ status: "error", message: "Unable to create your account right now." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!EMAIL_RE.test(email) || !password) {
      return res.status(400).json({ status: "error", message: "Enter your email and password." });
    }

    const user = await User.findOne({ email }).select("+passwordHash +passwordSalt");
    if (!user) {
      return res.status(401).json({ status: "error", message: "Incorrect email or password." });
    }

    const suppliedHash = await hashPassword(password, user.passwordSalt);
    const matches = crypto.timingSafeEqual(Buffer.from(suppliedHash, "hex"), Buffer.from(user.passwordHash, "hex"));
    if (!matches) {
      return res.status(401).json({ status: "error", message: "Incorrect email or password." });
    }

    return res.json({ status: "success", token: createToken(user), user: publicUser(user) });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ status: "error", message: "Unable to sign in right now." });
  }
});

router.get("/me", authenticateToken, (req, res) => {
  res.json({ status: "success", user: { id: req.user.userId, name: req.user.name, email: req.user.email } });
});

// Remove the user's saved screening history but keep their login account.
router.delete("/data", authenticateToken, async (req, res) => {
  try {
    const result = await Candidate.deleteMany({ userId: new mongoose.Types.ObjectId(req.user.userId) });
    return res.json({ status: "success", deletedCount: result.deletedCount || 0, message: "Your screening history has been cleared." });
  } catch (error) {
    console.error("Clear account data error:", error.message);
    return res.status(500).json({ status: "error", message: "Unable to clear your screening history." });
  }
});

// Permanently delete the user's account and all associated screening records.
router.delete("/account", authenticateToken, async (req, res) => {
  try {
    await Candidate.deleteMany({ userId: new mongoose.Types.ObjectId(req.user.userId) });
    await User.findByIdAndDelete(req.user.userId);
    return res.json({ status: "success", message: "Your account and associated screening data have been deleted." });
  } catch (error) {
    console.error("Delete account error:", error.message);
    return res.status(500).json({ status: "error", message: "Unable to delete your account right now." });
  }
});

module.exports = router;
