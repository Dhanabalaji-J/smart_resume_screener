const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


async function matchResumeWithJob(resume, jobDescription) {

    const prompt = `
You are an AI recruitment assistant.

Your task is to compare a candidate's resume with a job description.

Analyze the candidate based on:

1. Skills
2. Experience
3. Education
4. Overall suitability

CANDIDATE RESUME:

Skills:
${resume.skills.join(", ")}

Experience:
${resume.experience.join("\n")}

Education:
${resume.education.join("\n")}

JOB DESCRIPTION:

${jobDescription}

Return ONLY valid JSON.

Use exactly this structure:

{
    "matchScore": 0,
    "matchingSkills": [],
    "missingSkills": [],
    "experienceMatch": "",
    "educationMatch": "",
    "justification": ""
}

Rules:

- matchScore must be a number from 1 to 10.
- matchingSkills must contain skills found in both the resume and job requirements.
- missingSkills must contain important job requirements missing from the resume.
- experienceMatch should briefly explain whether the candidate's experience matches the job.
- educationMatch should briefly explain whether the candidate's education matches the job.
- justification should briefly explain the overall score.
- Do not add Markdown.
- Do not add code fences.
- Return JSON only.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
    });

    const text = response.text.trim();

    const cleanedText = text
        .replace(/^```json/i, "")
        .replace(/^```/i, "")
        .replace(/```$/i, "")
        .trim();

    return JSON.parse(cleanedText);
}


module.exports = {
    matchResumeWithJob
};