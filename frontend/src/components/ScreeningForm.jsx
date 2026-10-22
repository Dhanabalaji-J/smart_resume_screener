import { useState } from "react";
import axios from "axios";

function ScreeningForm({
    onAnalysisComplete,
    onNewScreening
}) {

    const [resumeFile, setResumeFile] = useState(null);

    const [jobDescription, setJobDescription] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =========================================
    // FILE CHANGE
    // =========================================

    const handleFileChange = (event) => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        if (file.type !== "application/pdf") {

            setError(
                "Please upload a PDF resume."
            );

            setResumeFile(null);

            return;
        }

        setError("");
        setSuccess("");

        // Clear previous RAY resume
        if (onNewScreening) {
            onNewScreening();
        }

        setResumeFile(file);
    };


    // =========================================
    // SUBMIT
    // =========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // Check resume

        if (!resumeFile) {

            setError(
                "Please upload a resume PDF."
            );

            return;
        }


        // Check job description

        if (!jobDescription.trim()) {

            setError(
                "Please enter a job description."
            );

            return;
        }


        try {

            setLoading(true);


           
const formData = new FormData();
formData.append("resume", resumeFile);

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error(
        "VITE_API_URL is missing. Check frontend/.env."
    );
}

const uploadResponse = await axios.post(
    `${API_URL}/api/resume/upload`,
    formData
);

const parsedResume = uploadResponse.data.parsedResume;

if (!parsedResume) {
    throw new Error("Resume parsing failed.");
}



            // =====================================
            // STEP 2: MATCH RESUME WITH JOB
            // =====================================

            const matchResponse =
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/job/match`,
                    {
                        name: resumeFile.name
                            .replace(/\.pdf$/i, ""),

                        resume: parsedResume,

                        jobDescription:
                            jobDescription
                    }
                );


            // =====================================
            // SUCCESS
            // =====================================

            setSuccess(
                "Resume analyzed successfully!"
            );


            // =====================================
            // SEND DATA TO APP.JSX
            // =====================================

            onAnalysisComplete({

                ...matchResponse.data,

                resume: parsedResume,

                jobDescription:
                    jobDescription

            });


        } catch (error) {

            console.error(
                "Resume screening error:",
                error
            );


            setError(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong."
            );


        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // JSX
    // =========================================

    return (

        <div
            className="screening-card"
            id="screen-resume"
        >

            <div className="screening-header">

                <h2>
                    Screen a Resume
                </h2>

                <p>
                    Upload a resume and compare it
                    with a job description using AI.
                </p>

            </div>


            <form onSubmit={handleSubmit}>


                {/* RESUME UPLOAD */}

                <div className="form-group">

                    <label>
                        Resume PDF
                    </label>


                    <div className="file-upload">

                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={
                                handleFileChange
                            }
                        />

                    </div>


                    {resumeFile && (

                        <p className="file-name">

                            ✓ {resumeFile.name}

                        </p>

                    )}

                </div>


                {/* JOB DESCRIPTION */}

                <div className="form-group">

                    <label>
                        Job Description
                    </label>


                    <textarea
                        rows="8"
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(event) =>
                            setJobDescription(
                                event.target.value
                            )
                        }
                    />

                </div>


                {/* ERROR */}

                {error && (

                    <div className="form-error">

                        {error}

                    </div>

                )}


                {/* SUCCESS */}

                {success && (

                    <div className="form-success">

                        {success}

                    </div>

                )}


                {/* BUTTON */}

                <button
                    type="submit"
                    className="analyze-button"
                    disabled={loading}
                >

                    {loading
                        ? "AI is analyzing..."
                        : "Analyze Resume"}

                </button>


            </form>

        </div>

    );

}

export default ScreeningForm;
