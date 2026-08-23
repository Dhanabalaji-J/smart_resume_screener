function Analytics({ candidates }) {

    const totalCandidates = candidates.length;

    const shortlisted = candidates.filter(
        candidate => candidate.analysis?.matchScore >= 7
    ).length;

    const review = candidates.filter(
        candidate => candidate.analysis?.matchScore < 7
    ).length;

    const averageScore =
        totalCandidates === 0
            ? 0
            : (
                candidates.reduce(
                    (sum, candidate) =>
                        sum + (candidate.analysis?.matchScore || 0),
                    0
                ) / totalCandidates
            ).toFixed(1);


    // Collect all skills
    const skillCount = {};

    candidates.forEach(candidate => {

        const skills =
            candidate.analysis?.matchingSkills || [];

        skills.forEach(skill => {

            skillCount[skill] =
                (skillCount[skill] || 0) + 1;

        });

    });


    const topSkills = Object.entries(skillCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);


    // Score distribution
    const scoreDistribution = {};

    for (let i = 1; i <= 10; i++) {
        scoreDistribution[i] = 0;
    }

    candidates.forEach(candidate => {

        const score =
            candidate.analysis?.matchScore;

        if (score >= 1 && score <= 10) {
            scoreDistribution[score]++;
        }

    });


    return (

        <section
            id="analytics"
            className="analytics-section"
        >

            <div className="analytics-header">

                <div>

                    <h2>
                        Analytics
                    </h2>

                    <p>
                        Overview of candidate screening
                        performance and matching results.
                    </p>

                </div>

            </div>


            {/* Summary Cards */}

            <div className="analytics-cards">

                <div className="analytics-card">

                    <span>
                        Total Candidates
                    </span>

                    <strong>
                        {totalCandidates}
                    </strong>

                </div>


                <div className="analytics-card">

                    <span>
                        Shortlisted
                    </span>

                    <strong>
                        {shortlisted}
                    </strong>

                </div>


                <div className="analytics-card">

                    <span>
                        Under Review
                    </span>

                    <strong>
                        {review}
                    </strong>

                </div>


                <div className="analytics-card">

                    <span>
                        Average Match
                    </span>

                    <strong>
                        {averageScore}/10
                    </strong>

                </div>

            </div>


            {/* Charts */}

            <div className="analytics-grid">


                {/* Score Distribution */}

                <div className="analytics-panel">

                    <div className="panel-title">

                        <h3>
                            Match Score Distribution
                        </h3>

                        <span>
                            Candidates by score
                        </span>

                    </div>


                    <div className="score-chart">

                        {Object.entries(
                            scoreDistribution
                        ).map(([score, count]) => {

                            const height =
                                totalCandidates === 0
                                    ? 0
                                    : Math.max(
                                        count * 45,
                                        count > 0 ? 12 : 0
                                    );

                            return (

                                <div
                                    className="score-column"
                                    key={score}
                                >

                                    <div className="bar-wrapper">

                                        <div
                                            className="score-bar"
                                            style={{
                                                height: `${height}px`
                                            }}
                                        >

                                            {count > 0 && (
                                                <span>
                                                    {count}
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                    <small>
                                        {score}
                                    </small>

                                </div>

                            );

                        })}

                    </div>

                </div>


                {/* Top Skills */}

                <div className="analytics-panel">

                    <div className="panel-title">

                        <h3>
                            Most Matched Skills
                        </h3>

                        <span>
                            Based on screened candidates
                        </span>

                    </div>


                    <div className="skills-chart">

                        {topSkills.length === 0 ? (

                            <p>
                                No skill data available.
                            </p>

                        ) : (

                            topSkills.map(
                                ([skill, count]) => {

                                    const max =
                                        topSkills[0][1];

                                    const width =
                                        (count / max) * 100;

                                    return (

                                        <div
                                            className="skill-row"
                                            key={skill}
                                        >

                                            <div className="skill-info">

                                                <span>
                                                    {skill}
                                                </span>

                                                <strong>
                                                    {count}
                                                </strong>

                                            </div>

                                            <div className="skill-track">

                                                <div
                                                    className="skill-fill"
                                                    style={{
                                                        width: `${width}%`
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    );

                                }
                            )

                        )}

                    </div>

                </div>

            </div>


            {/* Screening Status */}

            <div className="analytics-panel status-panel">

                <div className="panel-title">

                    <h3>
                        Screening Overview
                    </h3>

                    <span>
                        Current candidate status
                    </span>

                </div>


                <div className="status-overview">

                    <div className="status-item">

                        <div className="status-icon shortlisted-icon">
                            ✓
                        </div>

                        <div>

                            <strong>
                                {shortlisted}
                            </strong>

                            <span>
                                Shortlisted
                            </span>

                        </div>

                    </div>


                    <div className="status-item">

                        <div className="status-icon review-icon">
                            !
                        </div>

                        <div>

                            <strong>
                                {review}
                            </strong>

                            <span>
                                Needs Review
                            </span>

                        </div>

                    </div>


                    <div className="status-item">

                        <div className="status-icon score-icon">
                            ★
                        </div>

                        <div>

                            <strong>
                                {averageScore}/10
                            </strong>

                            <span>
                                Average Match
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default Analytics;