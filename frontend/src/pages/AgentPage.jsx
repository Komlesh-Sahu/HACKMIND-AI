import EmptyState from "../components/EmptyState.jsx";
import AlertCard from "../components/AlertCard.jsx";

const PIPELINE_STAGES = ["OBSERVE", "UNDERSTAND", "REASON", "DECIDE", "ACT", "MONITOR"];

function AgentPage({
  minutesToDeadline,
  onMinutesChange,
  alerts,
  loading,
  onRunAgent,
  resolvedTeams,
  onResolve,
  onEscalate,
}) {
  const topAlert = alerts[0];
  const criticalCount = alerts.filter((a) => a.priority === "CRITICAL").length;

  return (
    <section className="page">
      <div className="page-header">
        <p className="eyebrow">AGENT CORE</p>
        <h2>Autonomous Decision Engine</h2>
        <p className="muted">
          Set the remaining deadline time and let HACKMIND automatically detect submission risks.
        </p>
      </div>

      <div className="card pipeline-card">
        <div className={`pipeline${loading ? " pipeline-active" : ""}`}>
          {PIPELINE_STAGES.map((stage, index) => (
            <div className="pipeline-stage" key={stage}>
              <div className="pipeline-node">
                <span>{index + 1}</span>
              </div>
              <p>{stage}</p>
              {index < PIPELINE_STAGES.length - 1 && <div className="pipeline-connector" />}
            </div>
          ))}
        </div>

        <div className="agent-control">
          <div className="field field-inline">
            <label htmlFor="minutes-deadline">Minutes to deadline</label>
            <input
              id="minutes-deadline"
              type="number"
              min="0"
              value={minutesToDeadline}
              onChange={(e) => onMinutesChange(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={onRunAgent} disabled={loading}>
            {loading ? "Analyzing Event..." : "Run Autonomous Agent"}
          </button>
        </div>

        {topAlert && (
          <div className="reasoning-trace">
            <div className="reasoning-step">
              <strong>Observe</strong>
              <p>{minutesToDeadline} minutes remaining</p>
            </div>
            <div className="reasoning-step">
              <strong>Reason</strong>
              <p>
                {alerts.length} team{alerts.length === 1 ? "" : "s"} flagged with incomplete
                submissions
              </p>
            </div>
            <div className="reasoning-step">
              <strong>Decide</strong>
              <p>
                Risk level = {topAlert.priority}
                {criticalCount > 0 ? ` · ${criticalCount} critical` : ""}
              </p>
            </div>
            <div className="reasoning-step">
              <strong>Act</strong>
              <p>Generated {alerts.length} organizer alert{alerts.length === 1 ? "" : "s"}</p>
            </div>
          </div>
        )}
      </div>

      <div className="card alerts-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">AUTONOMOUS MONITORING</p>
            <h3>High Priority Alerts</h3>
          </div>
          <span className="alert-count">{alerts.length} Active</span>
        </div>

        {alerts.length === 0 ? (
          <EmptyState
            icon="◈"
            title="No active risks detected."
            description="HACKMIND will surface issues automatically once the agent runs."
          />
        ) : (
          <div className="alert-list">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.team}
                alert={alert}
                resolved={resolvedTeams.includes(alert.team)}
                onResolve={onResolve}
                onEscalate={onEscalate}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AgentPage;
