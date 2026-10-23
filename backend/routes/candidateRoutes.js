const express = require("express");
const mongoose = require("mongoose");
const Candidate = require("../models/Candidate");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();
router.use(authenticateToken);

// Return only this account's screening history.
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find({ userId: new mongoose.Types.ObjectId(req.user.userId) })
      .sort({ createdAt: -1, "analysis.matchScore": -1 });
    return res.json({ status: "success", count: candidates.length, candidates });
  } catch (error) {
    console.error("Get candidates error:", error.message);
    return res.status(500).json({ status: "error", message: "Failed to fetch your screening history." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ status: "error", message: "Invalid candidate ID." });
    }
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      userId: new mongoose.Types.ObjectId(req.user.userId)
    });
    if (!candidate) return res.status(404).json({ status: "error", message: "Candidate not found." });
    return res.json({ status: "success", candidate });
  } catch (error) {
    console.error("Get candidate error:", error.message);
    return res.status(500).json({ status: "error", message: "Failed to fetch candidate." });
  }
});

module.exports = router;
