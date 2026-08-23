function CandidateDetails({ candidate, onClose }) {

    if (!candidate) {
        return null;
    }

    const analysis = candidate.analysis;

    return (
        <div className="details-container">

            <div className="details-header">

                <h2>{candidate.name}</h2>

                <button onClick={onClose}>
                    Close
                </button>

            </div>

            <div className="score">
                <span>Match Score</span>
                <strong>
                    {analysis.matchScore}/10
                </strong>
            </div>

            <section>
                <h3>Matching Skills</h3>

                <div className="skills">
                    {analysis.matchingSkills.map(
                        skill => (
                            <span key={skill}>
                                {skill}
                            </span>
                        )
                    )}
                </div>
            </section>

            <section>
                <h3>Missing Skills</h3>

                {analysis.missingSkills.length === 0 ? (
                    <p>No important missing skills.</p>
                ) : (
                    <div className="skills missing">
                        {analysis.missingSkills.map(
                            skill => (
                                <span key={skill}>
                                    {skill}
                                </span>
                            )
                        )}
                    </div>
                )}
            </section>

            <section>
                <h3>Experience Match</h3>
                <p>{analysis.experienceMatch}</p>
            </section>

            <section>
                <h3>Education Match</h3>
                <p>{analysis.educationMatch}</p>
            </section>

            <section>
                <h3>AI Justification</h3>
                <p>{analysis.justification}</p>
            </section>

        </div>
    );
}

export default CandidateDetails;