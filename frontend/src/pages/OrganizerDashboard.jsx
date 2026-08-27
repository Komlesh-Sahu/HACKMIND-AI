import StatCard from "../components/StatCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import AlertCard from "../components/AlertCard.jsx";

function OrganizerDashboard({ stats, alerts, resolvedTeams, onResolve, onEscalate, onNavigate }) {
  const topAlerts = alerts.slice(0, 3);

  return (
    <section className="page">
      <div className="page-header page-header-split">
        <div>
          <p className="eyebrow">LIVE EVENT OPERATIONS</p>
          <h2>Organizer Command Center</h2>
        </div>
        <div className="live-badge">● LIVE</div>
      </div>

      <div className="stats-grid stats-grid-4">
        <StatCard label="Total Teams" value={stats.totalTeams} hint="Active in hackathon" />
        <StatCard label="Participants" value={stats.participants} hint="Registered hackers" />
        <StatCard label="Queries Resolved" value={stats.queriesResolved} hint="AI Concierge" />
        <StatCard
          label="Submission Risks"
          value={alerts.length}
          hint="Require attention"
          tone="danger"
        />
      </div>

      <div className="card alerts-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">AUTONOMOUS MONITORING</p>
            <h3>High Priority Alerts</h3>
          </div>
          <button className="link-button" onClick={() => onNavigate("alerts")}>
            View all →
          </button>
        </div>

        {topAlerts.length === 0 ? (
          <EmptyState
            icon="◈"
            title="No active risks detected."
            description="HACKMIND will surface issues automatically."
          />
        ) : (
          <div className="alert-list">
            {topAlerts.map((alert) => (
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

export default OrganizerDashboard;
