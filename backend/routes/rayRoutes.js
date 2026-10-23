const express = require("express");

const router = express.Router();

const geminiService = require("../services/geminiService");
const authenticateToken = require("../middleware/authenticateToken");

router.use(authenticateToken);

console.log("Gemini service loaded from:");
console.log(require.resolve("../services/geminiService"));

console.log("Gemini service exports:");
console.log(Object.keys(geminiService));

console.log("askRay type:");
console.log(typeof geminiService.askRay);


router.post("/chat", async (req, res) => {

    try {

        const {
            question,
            resume,
            jobDescription
        } = req.body;


        if (!question || question.trim() === "") {

            return res.status(400).json({
                status: "error",
                message: "Question is required"
            });

        }


        if (typeof geminiService.askRay !== "function") {

            return res.status(500).json({
                status: "error",
                message: "askRay is not available in geminiService"
            });

        }


        const result = await geminiService.askRay(
            question,
            resume,
            jobDescription
        );


        res.json({
            status: "success",
            response: result
        });


    } catch (error) {

        console.error("RAY error:", error);

        res.status(500).json({
            status: "error",
            message: "RAY failed to process your question",
            error: error.message
        });

    }

});


module.exports = router;