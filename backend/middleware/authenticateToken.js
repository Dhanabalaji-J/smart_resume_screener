const crypto = require("crypto");
const User = require("../models/User");

const secret = () => process.env.AUTH_TOKEN_SECRET || process.env.MONGODB_URI;

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

module.exports = async function authenticateToken(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!token) {
      return res.status(401).json({ status: "error", message: "Please sign in to continue." });
    }

    const parts = token.split(".");
    if (parts.length !== 2 || !secret()) {
      return res.status(401).json({ status: "error", message: "Your session is invalid. Please sign in again." });
    }

    const [payload, signature] = parts;
    const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
    if (!safeEqual(signature, expected)) {
      return res.status(401).json({ status: "error", message: "Your session is invalid. Please sign in again." });
    }

    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!session.userId || !session.exp || session.exp <= Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ status: "error", message: "Your session has expired. Please sign in again." });
    }

    const user = await User.findById(session.userId).select("_id name email");
    if (!user) {
      return res.status(401).json({ status: "error", message: "This account no longer exists. Please sign in again." });
    }

    req.user = { userId: String(user._id), name: user.name, email: user.email };
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error.message);
    return res.status(401).json({ status: "error", message: "Unable to verify your session. Please sign in again." });
  }
};
