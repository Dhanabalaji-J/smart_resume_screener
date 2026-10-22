
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

function isRetryableError(error) {
    const status = Number(error?.status ?? error?.code);

    return (
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        /high demand|temporarily unavailable|overloaded|resource exhausted/i.test(
            error?.message || ""
        )
    );
}

async function generateContentWithRetry(
    model,
    contents,
    maxAttempts = 3
) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await ai.models.generateContent({
                model,
                contents,
            });
        } catch (error) {
            const shouldRetry =
                isRetryableError(error) &&
                attempt < maxAttempts;

            if (!shouldRetry) {
                throw error;
            }

            const delayMs = 1000 * 2 ** (attempt - 1);

            console.warn(
                `Gemini request failed (attempt ${attempt}/${maxAttempts}). ` +
                `Retrying in ${delayMs}ms. Status: ${error?.status ?? error?.code ?? "unknown"}`
            );

            await sleep(delayMs);
        }
    }

    throw new Error("Gemini request failed after all retry attempts.");
}

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
${(resume.skills || []).join(", ")}

Experience:
${(resume.experience || []).join("\n")}

Education:
${(resume.education || []).join("\n")}

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

    const response = await generateContentWithRetry(
        "gemini-3.6-flash",
        prompt,
        3
    );

    const text =
        typeof response.text === "function"
            ? response.text()
            : response.text;

    if (!text || !text.trim()) {
        throw new Error("Gemini returned an empty response.");
    }

    const cleanedText = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    try {
        const result = JSON.parse(cleanedText);

        if (
            typeof result.matchScore !== "number" ||
            !Array.isArray(result.matchingSkills) ||
            !Array.isArray(result.missingSkills)
        ) {
            throw new Error("Gemini returned an unexpected JSON structure.");
        }

        return result;
    } catch (error) {
        console.error("Failed to parse Gemini matching response:", error.message);
        throw new Error("Unable to parse the AI matching result.");
    }
}

module.exports = {
    matchResumeWithJob,
};
