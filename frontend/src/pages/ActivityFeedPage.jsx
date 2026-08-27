import EmptyState from "../components/EmptyState.jsx";

const ICONS = {
  audit: "◒",
  agent: "◈",
  risk: "◑",
  alert: "▲",
  resolved: "✓",
  concierge: "◎",
};

function ActivityFeedPage({ activity }) {
  return (
    <section className="page">
      <div className="page-header">
        <p className="eyebrow">ACTIVITY FEED</p>
        <h2>Live Event Timeline</h2>
        <p className="muted">A running log of everything HACKMIND observes and acts on.</p>
      </div>

      <div className="card">
        {activity.length === 0 ? (
          <EmptyState
            icon="≡"
            title="No activity yet"
            description="Actions across the Concierge, Auditor and Agent Core will appear here."
          />
        ) : (
          <div className="activity-timeline">
            {activity.map((entry) => (
              <div className="activity-entry" key={entry.id}>
                <div className="activity-time">{entry.time}</div>
                <div className={`activity-icon activity-icon-${entry.type}`}>
                  {ICONS[entry.type] || "•"}
                </div>
                <div className="activity-text">{entry.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ActivityFeedPage;
