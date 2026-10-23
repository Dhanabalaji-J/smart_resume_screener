const express = require("express");

const router = express.Router();

const { testGemini } = require("../services/geminiService");
const { matchResumeWithJob } = require("../services/geminiMatchingService");

const Candidate = require("../models/Candidate");
const authenticateToken = require("../middleware/authenticateToken");


// Analyze job description
router.post("/analyze", (req, res) => {

    try {

        const { jobDescription } = req.body;

        // Check if job description exists
        if (!jobDescription || jobDescription.trim() === "") {
            return res.status(400).json({
                status: "error",
                message: "Job description is required"
            });
        }

        // For now, simply return the job description
        res.json({
            status: "success",
            message: "Job description received",
            jobDescription: jobDescription
        });

    } catch (error) {

        console.error("Job description error:", error);

        res.status(500).json({
            status: "error",
            message: "Failed to process job description"
        });
    }
});

router.get("/test-gemini", authenticateToken, async (req, res) => {
    try {
        const result = await testGemini();

        res.json({
            status: "success",
            message: "Gemini API is working",
            response: result
        });

    } catch (error) {
        console.error("Gemini API error:", error);

        res.status(500).json({
            status: "error",
            message: "Gemini API failed",
            error: error.message
        });
    }
});

router.post("/match", authenticateToken, async (req, res) => {

    try {

        const {
            name,
            resume,
            jobDescription
        } = req.body;

        if (!resume) {
            return res.status(400).json({
                status: "error",
                message: "Resume data is required"
            });
        }

        if (!jobDescription || jobDescription.trim() === "") {
            return res.status(400).json({
                status: "error",
                message: "Job description is required"
            });
        }

        const result = await matchResumeWithJob(
            resume,
            jobDescription
        );

        // Save candidate to MongoDB
        const candidate = await Candidate.create({
            userId: req.user.userId,
            name: name || "Unknown Candidate",

            resume: {
                skills: resume.skills,
                experience: resume.experience,
                education: resume.education
            },

            jobDescription: jobDescription,

            analysis: {
                matchScore: result.matchScore,
                matchingSkills: result.matchingSkills,
                missingSkills: result.missingSkills,
                experienceMatch: result.experienceMatch,
                educationMatch: result.educationMatch,
                justification: result.justification
            }
        });

        res.json({
            status: "success",
            message: "Resume matched and saved successfully",

            candidateId: candidate._id,

            result: result
        });

    } catch (error) {

        console.error("Resume matching error:", error);

        res.status(500).json({
            status: "error",
            message: "Failed to match resume",
            error: error.message
        });
    }
});


module.exports = router;