import { useEffect, useState } from "react";
import api from "../services/session";

function RayAssistant({ resume, jobDescription }) {

    const [open, setOpen] = useState(false);

    const [question, setQuestion] = useState("");

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);

    const [uploadedResume, setUploadedResume] =
        useState(null);

    const [uploading, setUploading] =
        useState(false);

    const [resumeName, setResumeName] =
        useState("");


    // =========================================
    // RESET / SYNC RESUME
    // =========================================

    useEffect(() => {

        if (resume) {

            setUploadedResume(resume);

        } else {

            setUploadedResume(null);

            setResumeName("");

            setMessages([]);

        }

    }, [resume]);


    // =========================================
    // UPLOAD RESUME
    // =========================================

    const handleResumeUpload = async (event) => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }


        if (file.type !== "application/pdf") {

            setMessages([
                {
                    role: "ray",
                    text:
                        "Please upload a PDF resume."
                }
            ]);

            event.target.value = "";

            return;
        }


        try {

            setUploading(true);


            const formData = new FormData();

            formData.append(
                "resume",
                file
            );


            const response = await api.post(
                "/resume/upload",
                formData
            );


            const parsedResume =
                response.data.parsedResume;


            if (!parsedResume) {

                throw new Error(
                    "Resume parsing failed."
                );

            }


            // New resume replaces old resume

            setUploadedResume(
                parsedResume
            );

            setResumeName(
                file.name
            );


            // Clear previous RAY conversation

            setMessages([
                {
                    role: "ray",
                    text:
                        `✓ ${file.name} uploaded successfully. You can now ask me questions about this resume.`
                }
            ]);


        } catch (error) {

            console.error(
                "Resume upload error:",
                error
            );


            setMessages(prev => [
                ...prev,
                {
                    role: "ray",
                    text:
                        error.response?.data?.message ||
                        "Unable to upload and analyze the resume."
                }
            ]);


        } finally {

            setUploading(false);

            event.target.value = "";

        }

    };


    // =========================================
    // ASK RAY
    // =========================================

    const askRay = async () => {

        if (!question.trim()) {
            return;
        }


        const userQuestion =
            question.trim();


        setMessages(prev => [
            ...prev,
            {
                role: "user",
                text: userQuestion
            }
        ]);


        setQuestion("");

        setLoading(true);


        try {

            const response = await api.post(
                "/ray/chat",
                {
                    question: userQuestion,

                    resume:
                        uploadedResume ||
                        resume,

                    jobDescription:
                        jobDescription
                }
            );


            setMessages(prev => [
                ...prev,
                {
                    role: "ray",
                    text:
                        response.data.response
                }
            ]);


        } catch (error) {

            console.error(
                "RAY error:",
                error
            );


            setMessages(prev => [
                ...prev,
                {
                    role: "ray",
                    text:
                        error.response?.data?.message ||
                        "Sorry, RAY could not process your question."
                }
            ]);


        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // ENTER KEY
    // =========================================

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            askRay();

        }

    };


    // =========================================
    // CLOSED RAY
    // =========================================

    if (!open) {

        return (

            <button
                className="ray-button"
                onClick={() => setOpen(true)}
            >
                ✦ Ask RAY
            </button>

        );

    }


    // =========================================
    // RAY UI
    // =========================================

    return (

        <div className="ray-chat">


            {/* HEADER */}

            <div className="ray-header">

                <div>

                    <strong>
                        ✦ RAY
                    </strong>

                    <span>
                        Resume AI Assistant
                    </span>

                </div>


                <button
                    className="ray-close"
                    onClick={() =>
                        setOpen(false)
                    }
                >
                    ×
                </button>

            </div>


            {/* MESSAGES */}

            <div className="ray-messages">


                {/* WELCOME */}

                {messages.length === 0 && (

                    <div className="ray-welcome">

                        <div className="ray-welcome-icon">
                            ✦
                        </div>


                        <h3>
                            Hi! I'm RAY
                        </h3>


                        <p>
                            Upload your resume and
                            ask me anything related to
                            improving it.
                        </p>


                        <label
                            className="ray-upload-welcome"
                        >

                            📎 Upload Resume

                            <input
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={
                                    handleResumeUpload
                                }
                                hidden
                            />

                        </label>


                        <div className="ray-suggestions">

                            <button
                                onClick={() =>
                                    setQuestion(
                                        "How can I improve my resume?"
                                    )
                                }
                            >
                                Improve my resume
                            </button>


                            <button
                                onClick={() =>
                                    setQuestion(
                                        "What skills should I add to my resume?"
                                    )
                                }
                            >
                                Missing skills
                            </button>


                            <button
                                onClick={() =>
                                    setQuestion(
                                        "Improve my professional summary"
                                    )
                                }
                            >
                                Improve summary
                            </button>

                        </div>

                    </div>

                )}


                {/* CHAT MESSAGES */}

                {messages.map(
                    (message, index) => (

                        <div
                            key={index}
                            className={
                                message.role === "user"
                                    ? "ray-message user"
                                    : "ray-message assistant"
                            }
                        >

                            {message.role === "ray" && (

                                <div className="ray-avatar">
                                    ✦
                                </div>

                            )}


                            <div className="ray-message-text">

                                {message.text}

                            </div>

                        </div>

                    )
                )}


                {/* LOADING */}

                {loading && (

                    <div className="ray-message assistant">

                        <div className="ray-avatar">
                            ✦
                        </div>


                        <div className="ray-typing">

                            <span></span>
                            <span></span>
                            <span></span>

                        </div>

                    </div>

                )}

            </div>


            {/* CURRENT RESUME */}

            {uploadedResume && (

                <div className="ray-resume-indicator">

                    <span>
                        📄
                    </span>


                    <div>

                        <strong>
                            Resume loaded
                        </strong>


                        <small>
                            {resumeName ||
                                "Current resume"}
                        </small>

                    </div>

                </div>

            )}


            {/* INPUT */}

            <div className="ray-input-area">


                {/* ATTACH */}

                <label
                    className="ray-attach-button"
                    title="Upload resume"
                >

                    📎

                    <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={
                            handleResumeUpload
                        }
                        hidden
                    />

                </label>


                {/* QUESTION */}

                <textarea
                    value={question}
                    onChange={(event) =>
                        setQuestion(
                            event.target.value
                        )
                    }
                    onKeyDown={handleKeyDown}
                    placeholder={
                        uploading
                            ? "Uploading resume..."
                            : "Ask RAY about your resume..."
                    }
                    rows="2"
                    disabled={uploading}
                />


                {/* SEND */}

                <button
                    onClick={askRay}
                    disabled={
                        loading ||
                        uploading ||
                        !question.trim()
                    }
                >
                    ➤
                </button>

            </div>


            {/* DISCLAIMER */}

            <div className="ray-disclaimer">

                RAY only answers resume &
                job-related questions.

            </div>

        </div>

    );

}

export default RayAssistant;
