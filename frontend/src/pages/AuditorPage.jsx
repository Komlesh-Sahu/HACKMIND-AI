import { useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import PriorityBadge from "../components/PriorityBadge.jsx";

const CHECKLIST_ITEMS = [
  { key: "GitHub repository", label: "GitHub Repository" },
  { key: "Demo video", label: "Demo Video" },
  { key: "README", label: "README" },
  { key: "Problem statement", label: "Problem Statement" },
];

function statusPriority(complete, missingCount) {
  if (complete) return "LOW";
  if (missingCount >= 2) return "CRITICAL";
  if (missingCount === 1) return "HIGH";
  return "MEDIUM";
}

function AuditorPage({ result, loading, onAudit }) {
  const [teamName, setTeamName] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [hasReadme, setHasReadme] = useState(false);
  const [problemStatement, setProblemStatement] = useState("");
  const [touched, setTouched] = useState(false);

  const teamNameError =
    touched && !teamName.trim() ? "Team name is required." : "";

  const submit = () => {
    setTouched(true);
    if (!teamName.trim()) return;

    onAudit({
      teamName: teamName.trim(),
      githubUrl: githubUrl.trim(),
      demoUrl: demoUrl.trim(),
      hasReadme,
      problemStatement: problemStatement.trim(),
    });
  };

  const missing = result?.missing || [];

  const readiness = result
    ? Math.round(
        ((CHECKLIST_ITEMS.length - missing.length) / CHECKLIST_ITEMS.length) *
          100
      )
    : 0;

  const priority = result
    ? statusPriority(result.complete, missing.length)
    : null;

  return (
    <section className="page">
      <div className="page-header">
        <p className="eyebrow">SUBMISSION AUDITOR</p>
        <h2>Check Submission Compliance</h2>
        <p className="muted">
          Detect missing requirements before the judging deadline.
        </p>
      </div>

      <div className="split-grid">
        <div className="card">
          <h3 className="card-title">Project details</h3>

          <div className="form-stack">
            <div className="field">
              <label htmlFor="audit-team">Team name</label>
              <input
                id="audit-team"
                type="text"
                placeholder="e.g. Team Phoenix"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              {teamNameError && (
                <span className="field-error">{teamNameError}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="audit-github">GitHub repository URL</label>
              <input
                id="audit-github"
                type="text"
                placeholder="https://github.com/your-team/project"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="audit-demo">Demo video URL</label>
              <input
                id="audit-demo"
                type="text"
                placeholder="https://youtube.com/..."
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="audit-problem">Problem statement</label>
              <input
                id="audit-problem"
                type="text"
                placeholder="One line describing the problem you solved"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
              />
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={hasReadme}
                onChange={(e) => setHasReadme(e.target.checked)}
              />
              README included
            </label>

            <button
              className="btn-primary"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Auditing..." : "Run Submission Audit"}
            </button>
          </div>
        </div>

        <div className="card audit-result-panel">
          <h3 className="card-title">Compliance report</h3>

          {loading && <LoadingState label="Analyzing submission..." />}

          {!loading && !result && (
            <EmptyState
              icon="◒"
              title="No audit run yet"
              description="Submit project information to run an automated compliance check."
            />
          )}

          {!loading && result && (
            <>
              <div className="readiness-block">
                <div className="readiness-label">
                  <span>Submission Readiness</span>
                  <strong>{readiness}%</strong>
                </div>

                <ProgressBar
                  value={readiness}
                  tone={
                    readiness === 100
                      ? "success"
                      : readiness >= 50
                      ? "warning"
                      : "critical"
                  }
                />
              </div>

              <div className="checklist">
                {CHECKLIST_ITEMS.map((item) => {
                  const isMissing = missing.includes(item.key);

                  return (
                    <div
                      key={item.key}
                      className={`checklist-item${
                        isMissing ? " checklist-item-missing" : ""
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={isMissing ? "check-fail" : "check-pass"}
                      >
                        {isMissing ? "✕" : "✓"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="status-row">
                <span className="status-row-label">STATUS</span>
                <PriorityBadge priority={priority} />
              </div>

              <h4 className="audit-status-text">{result.status}</h4>

              {missing.length > 0 && (
                <div className="missing-list">
                  <p>Missing requirements:</p>

                  {missing.map((item) => (
                    <div className="missing-item" key={item}>
                      ✕ {item}
                    </div>
                  ))}

                  <p className="recommended-action">
                    Recommended action: Upload the missing items above before
                    the deadline.
                  </p>
                </div>
              )}

              {result.complete && (
                <p className="success-message">
                  ✓ All required submission items are present.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default AuditorPage;
