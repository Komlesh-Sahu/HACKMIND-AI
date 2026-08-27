import ProgressBar from "../components/ProgressBar.jsx";

function ParticipantDashboard({ onNavigate, auditResult, matchResults, latestAnswer }) {
  const missing = auditResult?.missing || [];
  const readiness = auditResult
    ? Math.round(((4 - missing.length) / 4) * 100)
    : null;

  return (
    <section className="page">
      <div className="welcome-header">
        <p className="eyebrow">WELCOME TO HACKMIND</p>
        <h2>Your AI companion for the hackathon</h2>
        <p className="muted">
          Ask questions, find teammates and verify your submission — all from one place.
        </p>
      </div>

      <div className="quick-actions">
        <button onClick={() => onNavigate("concierge")}>
          <span>◈</span> Ask AI Concierge
        </button>
        <button onClick={() => onNavigate("matcher")}>
          <span>◎</span> Find Teammates
        </button>
        <button onClick={() => onNavigate("auditor")}>
          <span>◒</span> Check Submission
        </button>
      </div>

      <div className="stats-grid stats-grid-4">
        <div className="card stat-card">
          <span className="stat-card-label">Submission Readiness</span>
          {readiness === null ? (
            <>
              <strong className="stat-card-value">—</strong>
              <small className="stat-card-hint">Run an audit to see your status</small>
            </>
          ) : (
            <>
              <strong className="stat-card-value">{readiness}%</strong>
              <ProgressBar value={readiness} tone={readiness === 100 ? "success" : readiness >= 50 ? "warning" : "critical"} />
            </>
          )}
        </div>

        <div className="card stat-card">
          <span className="stat-card-label">Team Status</span>
          <strong className="stat-card-value">
            {matchResults.length > 0 ? `${matchResults.length} matches` : "—"}
          </strong>
          <small className="stat-card-hint">
            {matchResults.length > 0
              ? `Top match: ${matchResults[0]?.candidate}`
              : "Find teammates to see recommendations"}
          </small>
        </div>

        <div className="card stat-card">
          <span className="stat-card-label">Latest AI Answer</span>
          <p className="stat-card-text">
            {latestAnswer ? latestAnswer : "No questions asked yet"}
          </p>
        </div>

        <div className="card stat-card">
          <span className="stat-card-label">Upcoming Deadline</span>
          <strong className="stat-card-value">Final Submission</strong>
          <small className="stat-card-hint">Check the Agent Core for live countdown</small>
        </div>
      </div>
    </section>
  );
}

export default ParticipantDashboard;
