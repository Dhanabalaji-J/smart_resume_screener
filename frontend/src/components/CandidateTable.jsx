function CandidateTable({ candidates, onSelect }) {

    return (
        <div className="candidate-section">

            <div className="section-heading">

                <div>
                    <h2>Recent Candidates</h2>

                    <p>
                        AI-screened candidates ranked by match score
                    </p>
                </div>

                <span className="candidate-count">
                    {candidates.length} candidates
                </span>

            </div>


            <div className="candidate-list">

                {candidates.map(candidate => {

                    const score =
                        candidate.analysis.matchScore;

                    const shortlisted = score >= 7;

                    return (
                        <div
                            className="candidate-card"
                            key={candidate._id}
                        >

                            <div className="candidate-avatar">
                                {candidate.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>


                            <div className="candidate-info">

                                <h3>
                                    {candidate.name}
                                </h3>

                                <div className="candidate-skills">

                                    {candidate.analysis.matchingSkills
                                        .slice(0, 5)
                                        .map(skill => (
                                            <span key={skill}>
                                                {skill}
                                            </span>
                                        ))}

                                    {candidate.analysis.matchingSkills.length > 5 && (
                                        <span>
                                            +
                                            {candidate.analysis.matchingSkills.length - 5}
                                        </span>
                                    )}

                                </div>

                            </div>


                            <div className="candidate-score">

                                <strong>
                                    {score}/10
                                </strong>

                                <span>
                                    Match Score
                                </span>

                            </div>


                            <div
                                className={
                                    shortlisted
                                        ? "candidate-status shortlisted"
                                        : "candidate-status review"
                                }
                            >
                                <span></span>

                                {shortlisted
                                    ? "Shortlisted"
                                    : "Review"}
                            </div>


                            <button
                                className="view-button"
                                onClick={() =>
                                    onSelect(candidate)
                                }
                            >
                                View
                                <span>→</span>
                            </button>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default CandidateTable;