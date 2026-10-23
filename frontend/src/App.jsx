import { useState } from "react";

import Navbar from "./components/Navbar";
import StatsCards from "./components/StatsCards";
import CandidateTable from "./components/CandidateTable";
import CandidateDetails from "./components/CandidateDetails";
import ScreeningForm from "./components/ScreeningForm";
import Analytics from "./components/Analytics";
import RayAssistant from "./components/RayAssistant";

import "./App.css";


function App() {

    // =========================================
    // CURRENT SESSION CANDIDATES
    // =========================================

    const [candidates, setCandidates] = useState([]);


    // =========================================
    // SELECTED CANDIDATE
    // =========================================

    const [selectedCandidate, setSelectedCandidate] =
        useState(null);


    // =========================================
    // LATEST ANALYSIS
    // =========================================

    const [analysisResult, setAnalysisResult] =
        useState(null);


    // =========================================
    // NAVIGATION
    // =========================================

    const [activeSection, setActiveSection] =
        useState("dashboard");


    // =========================================
    // RAY CURRENT RESUME
    // =========================================

    const [currentResume, setCurrentResume] =
        useState(null);


    // =========================================
    // RAY CURRENT JOB DESCRIPTION
    // =========================================

    const [currentJobDescription, setCurrentJobDescription] =
        useState("");


    // =========================================
    // NAVIGATION
    // =========================================

    const handleNavigation = (section) => {

        setActiveSection(section);


        if (section === "dashboard") {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }


        if (section === "screen") {

            document
                .getElementById("screen-resume")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }


        if (section === "candidates") {

            document
                .getElementById("candidates")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }


        if (section === "analytics") {

            document
                .getElementById("analytics")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }

    };


    // =========================================
    // NEW SCREENING
    // CLEAR CURRENT RAY CONTEXT
    // =========================================

    const handleNewScreening = () => {

        setCurrentResume(null);

        setCurrentJobDescription("");

        setAnalysisResult(null);

        setSelectedCandidate(null);

    };


    // =========================================
    // ANALYSIS COMPLETE
    // =========================================

    const handleAnalysisComplete = (data) => {

        console.log(
            "Analysis completed:",
            data
        );


        // =====================================
        // SAVE ANALYSIS RESULT
        // =====================================

        setAnalysisResult(data);


        // =====================================
        // SAVE RESUME FOR RAY
        // =====================================

        if (data.resume) {

            setCurrentResume(
                data.resume
            );

        }


        // =====================================
        // SAVE JOB DESCRIPTION FOR RAY
        // =====================================

        if (data.jobDescription) {

            setCurrentJobDescription(
                data.jobDescription
            );

        }


        // =====================================
        // CREATE CURRENT SESSION CANDIDATE
        // =====================================

        if (data.result) {

            const newCandidate = {

                _id:
                    data.candidate?._id ||
                    Date.now().toString(),

                name:
                    data.candidate?.name ||
                    data.name ||
                    "Resume",

                analysis:
                    data.candidate?.analysis ||
                    data.result

            };


            // Add new candidate to current session

            setCandidates(
                previousCandidates => [
                    ...previousCandidates,
                    newCandidate
                ]
            );

        }

    };


    // =========================================
    // RETURN
    // =========================================

    return (

        <div className="app">


            {/* =================================
                NAVBAR
            ================================= */}

            <Navbar
                activeSection={activeSection}
                onNavigate={handleNavigation}
            />


            {/* =================================
                MAIN CONTENT
            ================================= */}

            <main className="container">


                {/* =================================
                    PAGE HEADER
                ================================= */}

                <div className="page-header">

                    <div>

                        <h1>
                            AI Resume Screener
                        </h1>

                        <p>
                            Analyze resumes with AI, evaluate skills and experience,
                            and match candidates to job requirements.
                        </p>

                    </div>

                </div>


                {/* PREMIUM INTRO / HERO */}
                <section className="hero-panel" aria-labelledby="hero-title">
                    <div className="hero-copy">
                        <div className="hero-kicker">
                            <span className="hero-kicker-dot" />
                            AI-POWERED TALENT INTELLIGENCE
                        </div>
                        <h2 id="hero-title">
                            Find the right talent.
                            <span> Make every match count.</span>
                        </h2>
                        <p>
                            Turn resumes into clear, actionable insights.
                            Compare skills, experience, and education in one
                            simple screening workspace.
                        </p>
                        <div className="hero-actions">
                            <button
                                type="button"
                                className="hero-primary"
                                onClick={() => handleNavigation("screen")}
                            >
                                Start screening <span aria-hidden="true">↗</span>
                            </button>
                            <button
                                type="button"
                                className="hero-secondary"
                                onClick={() => handleNavigation("analytics")}
                            >
                                Explore analytics
                            </button>
                        </div>
                        <div className="hero-capabilities">
                            <span><b>✓</b> Resume parsing</span>
                            <span><b>✓</b> Skill comparison</span>
                            <span><b>✓</b> AI insights</span>
                        </div>
                    </div>

                    <div className="hero-visual" aria-label="Illustration of AI-powered resume analysis">
                        <div className="hero-orbit orbit-one" />
                        <div className="hero-orbit orbit-two" />
                        <div className="hero-orb">
                            <span className="orb-core">✦</span>
                        </div>
                        <div className="hero-float-card resume-float">
                            <div className="float-card-icon">▤</div>
                            <div className="float-card-copy">
                                <strong>Resume parsed</strong>
                                <span>Skills · Experience · Education</span>
                            </div>
                            <span className="float-check">✓</span>
                        </div>
                        <div className="hero-float-card insight-float">
                            <div className="insight-heading">
                                <span className="insight-spark">✧</span>
                                <strong>AI insights</strong>
                            </div>
                            <div className="insight-line line-long" />
                            <div className="insight-line line-medium" />
                            <div className="insight-line line-short" />
                            <div className="insight-tags">
                                <span>Skills</span><span>Fit</span><span>Growth</span>
                            </div>
                        </div>
                        <div className="hero-visual-caption">
                            <span className="caption-pulse" />
                            Intelligent screening, made simple
                        </div>
                    </div>
                </section>

                {/* =================================
                    STATS
                ================================= */}

                <StatsCards
                    candidates={candidates}
                />


                {/* =================================
                    RESUME SCREENING
                ================================= */}

                <div id="screen-resume">

                    <ScreeningForm
                        onAnalysisComplete={
                            handleAnalysisComplete
                        }

                        onNewScreening={
                            handleNewScreening
                        }
                    />

                </div>


                {/* =================================
                    LATEST AI ANALYSIS
                ================================= */}

                {analysisResult &&
                    analysisResult.result && (

                    <div className="new-result">

                        <h2>
                            Latest AI Analysis
                        </h2>


                        {/* MATCH SCORE */}

                        <div className="new-score">

                            Match Score:{" "}

                            <strong>

                                {
                                    analysisResult
                                        .result
                                        .matchScore
                                }/10

                            </strong>

                        </div>


                        {/* MATCHING SKILLS */}

                        <h3>
                            Matching Skills
                        </h3>

                        <div className="skills">

                            {
                                analysisResult
                                    .result
                                    .matchingSkills
                                    ?.map(
                                        skill => (

                                            <span
                                                key={skill}
                                            >
                                                {skill}
                                            </span>

                                        )
                                    )
                            }

                        </div>


                        {/* MISSING SKILLS */}

                        <h3>
                            Missing Skills
                        </h3>


                        {
                            analysisResult
                                .result
                                .missingSkills
                                ?.length === 0

                                ? (

                                    <p>
                                        No important
                                        missing skills.
                                    </p>

                                )

                                : (

                                    <div className="skills missing">

                                        {
                                            analysisResult
                                                .result
                                                .missingSkills
                                                ?.map(
                                                    skill => (

                                                        <span
                                                            key={skill}
                                                        >
                                                            {skill}
                                                        </span>

                                                    )
                                                )
                                        }

                                    </div>

                                )
                        }


                        {/* EXPERIENCE */}

                        <h3>
                            Experience Match
                        </h3>

                        <p>

                            {
                                analysisResult
                                    .result
                                    .experienceMatch
                            }

                        </p>


                        {/* EDUCATION */}

                        <h3>
                            Education Match
                        </h3>

                        <p>

                            {
                                analysisResult
                                    .result
                                    .educationMatch
                            }

                        </p>


                        {/* JUSTIFICATION */}

                        <h3>
                            AI Justification
                        </h3>

                        <p>

                            {
                                analysisResult
                                    .result
                                    .justification
                            }

                        </p>

                    </div>

                )}


                {/* =================================
                    CANDIDATES
                ================================= */}

                <div id="candidates">

                    <CandidateTable
                        candidates={candidates}
                        onSelect={
                            setSelectedCandidate
                        }
                    />

                </div>


                {/* =================================
                    CANDIDATE DETAILS
                ================================= */}

                <CandidateDetails
                    candidate={selectedCandidate}

                    onClose={() =>
                        setSelectedCandidate(null)
                    }
                />


                {/* =================================
                    ANALYTICS
                ================================= */}

                <div id="analytics">

                    <Analytics
                        candidates={candidates}
                    />

                </div>


            </main>


            {/* =================================
                RAY AI ASSISTANT
            ================================= */}

            <RayAssistant
                resume={currentResume}

                jobDescription={
                    currentJobDescription
                }
            />


        </div>

    );

}


export default App;