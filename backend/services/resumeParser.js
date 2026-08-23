function cleanLines(text) {
    return text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);
}

function extractSection(text, startHeading, endHeadings) {
    const lines = cleanLines(text);

    const startIndex = lines.findIndex(
        line => line.toLowerCase() === startHeading.toLowerCase()
    );

    if (startIndex === -1) {
        return [];
    }

    const section = [];

    for (let i = startIndex + 1; i < lines.length; i++) {
        const currentLine = lines[i].toLowerCase();

        const isNextSection = endHeadings.some(
            heading => currentLine === heading.toLowerCase()
        );

        if (isNextSection) {
            break;
        }

        section.push(lines[i]);
    }

    return section;
}


// Extract skills
function extractSkills(text) {
    const skillsSection = extractSection(
        text,
        "Technical Skills",
        [
            "Professional Experience",
            "Experience",
            "Education",
            "Awards & Accomplishments",
            "Languages"
        ]
    );

    const skills = [];

    skillsSection.forEach(line => {
        // Example:
        // Frontend: HTML5, CSS3, JavaScript, React.js

        if (line.includes(":")) {
            const parts = line.split(":");

            const skillList = parts
                .slice(1)
                .join(":")
                .split(",");

            skillList.forEach(skill => {
                const cleaned = skill.trim();

                if (cleaned) {
                    skills.push(cleaned);
                }
            });
        }
    });

    return [...new Set(skills)];
}


// Extract experience
function extractExperience(text) {
    const experienceSection = extractSection(
        text,
        "Professional Experience",
        [
            "Education",
            "Awards & Accomplishments",
            "Languages"
        ]
    );

    return experienceSection;
}


// Extract education
function extractEducation(text) {
    const educationSection = extractSection(
        text,
        "Education",
        [
            "Awards & Accomplishments",
            "Languages"
        ]
    );

    return educationSection;
}


// Main parser
function parseResume(text) {
    return {
        skills: extractSkills(text),
        experience: extractExperience(text),
        education: extractEducation(text)
    };
}

module.exports = {
    parseResume
};