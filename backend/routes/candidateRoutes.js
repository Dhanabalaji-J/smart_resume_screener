const express = require("express");
const Candidate = require("../models/Candidate");

const router = express.Router();


// Get all candidates
router.get("/", async (req, res) => {

    try {

        const candidates = await Candidate.find()
            .sort({ "analysis.matchScore": -1 });

        res.json({
            status: "success",
            count: candidates.length,
            candidates: candidates
        });

    } catch (error) {

        console.error("Get candidates error:", error);

        res.status(500).json({
            status: "error",
            message: "Failed to fetch candidates"
        });
    }
});


// Get candidate by ID
router.get("/:id", async (req, res) => {

    try {

        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({
                status: "error",
                message: "Candidate not found"
            });
        }

        res.json({
            status: "success",
            candidate: candidate
        });

    } catch (error) {

        console.error("Get candidate error:", error);

        res.status(500).json({
            status: "error",
            message: "Failed to fetch candidate"
        });
    }
});


module.exports = router;