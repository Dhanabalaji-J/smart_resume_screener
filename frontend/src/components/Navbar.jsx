function Navbar({ activeSection, onNavigate }) {
    return (
        <aside className="sidebar">

            <div className="brand">
                <div className="brand-icon">
                    ✦
                </div>

                <div>
                    <div className="brand-name">
                        ResumeAI
                    </div>

                    <div className="brand-subtitle">
                        Smart Screening
                    </div>
                </div>
            </div>


            <div className="sidebar-section">

                <div className="sidebar-label">
                    WORKSPACE
                </div>


                <button
                    className={`sidebar-item ${
                        activeSection === "dashboard"
                            ? "active"
                            : ""
                    }`}
                    onClick={() => onNavigate("dashboard")}
                >
                    <span>▣</span>
                    Dashboard
                </button>


                <button
                    className={`sidebar-item ${
                        activeSection === "screen"
                            ? "active"
                            : ""
                    }`}
                    onClick={() => onNavigate("screen")}
                >
                    <span>◉</span>
                    Screen Resume
                </button>


                <button
                    className={`sidebar-item ${
                        activeSection === "candidates"
                            ? "active"
                            : ""
                    }`}
                    onClick={() => onNavigate("candidates")}
                >
                    <span>♙</span>
                    Candidates
                </button>


                <button
                    className={`sidebar-item ${
                        activeSection === "analytics"
                            ? "active"
                            : ""
                    }`}
                    onClick={() => onNavigate("analytics")}
                >
                    <span>◈</span>
                    Analytics
                </button>

            </div>


            <div className="sidebar-bottom">

                <div className="ai-status">

                    <span className="status-dot"></span>

                    <div>
                        <strong>AI Engine</strong>
                        <small>Gemini Active</small>
                    </div>

                </div>

            </div>

        </aside>
    );
}

export default Navbar;