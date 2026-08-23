function StatsCards({ candidates }) {

    const totalCandidates = candidates.length;

    const shortlisted = candidates.filter(
        candidate => candidate.analysis.matchScore >= 7
    ).length;

    const averageScore =
        totalCandidates === 0
            ? 0
            : (
                candidates.reduce(
                    (sum, candidate) =>
                        sum + candidate.analysis.matchScore,
                    0
                ) / totalCandidates
            ).toFixed(1);

    return (
        <div className="stats-container">

            <div className="stat-card">

                <div className="stat-icon blue">
                    ♙
                </div>

                <div className="stat-content">
                    <span>Total Candidates</span>
                    <strong>{totalCandidates}</strong>
                </div>

            </div>


            <div className="stat-card">

                <div className="stat-icon green">
                    ✓
                </div>

                <div className="stat-content">
                    <span>Shortlisted</span>
                    <strong>{shortlisted}</strong>
                </div>

            </div>


            <div className="stat-card">

                <div className="stat-icon purple">
                    ✦
                </div>

                <div className="stat-content">
                    <span>Average Match</span>
                    <strong>{averageScore}<small>/10</small></strong>
                </div>

            </div>

        </div>
    );
}

export default StatsCards;