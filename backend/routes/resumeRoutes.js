const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const { parseResume } = require("../services/resumeParser");

const router = express.Router();

// Store uploaded files in uploads folder
const upload = multer({
    dest: "uploads/"
});

// Upload resume
router.post("/upload", upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "Please upload a resume PDF"
            });
        }

        // Read uploaded PDF
        const dataBuffer = fs.readFileSync(req.file.path);

        // Create PDF parser
        const parser = new PDFParse({
            data: dataBuffer
        });

        // Extract text
        const result = await parser.getText();

        // Free parser resources
        await parser.destroy();

        const parsedResume = parseResume(result.text);

            res.json({
                status: "success",
                message: "Resume uploaded and parsed successfully",
                fileName: req.file.originalname,

                extractedText: result.text,

                parsedResume: parsedResume
            });

    } catch (error) {
        console.error("PDF processing error:", error);

        res.status(500).json({
            status: "error",
            message: "Failed to process resume",
            error: error.message
        });
    } finally {
        // Uploaded PDFs are temporary input only; never leave them on disk.
        if (req.file?.path) {
            fs.promises.unlink(req.file.path).catch(() => {});
        }
    }
});

module.exports = router;