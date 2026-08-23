const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        resume: {
            skills: {
                type: [String],
                default: []
            },

            experience: {
                type: [String],
                default: []
            },

            education: {
                type: [String],
                default: []
            }
        },

        jobDescription: {
            type: String,
            required: true
        },

        analysis: {
            matchScore: {
                type: Number,
                required: true
            },

            matchingSkills: {
                type: [String],
                default: []
            },

            missingSkills: {
                type: [String],
                default: []
            },

            experienceMatch: {
                type: String,
                default: ""
            },

            educationMatch: {
                type: String,
                default: ""
            },

            justification: {
                type: String,
                default: ""
            }
        }
    },
    {
        timestamps: true
    }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;