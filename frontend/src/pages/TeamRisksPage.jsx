import EmptyState from "../components/EmptyState.jsx";
import AlertCard from "../components/AlertCard.jsx";

const TIERS = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

function TeamRisksPage({ alerts, resolvedTeams, onResolve, onEscalate }) {
  return (
    <section className="page">
      <div className="page-header">
        <p className="eyebrow">TEAM RISKS</p>
        <h2>Submission Risk Breakdown</h2>
        <p className="muted">Teams grouped by the Agent Core's current priority classification.</p>
      </div>

      {alerts.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="◒"
            title="No active risks detected."
            description="HACKMIND will surface issues automatically once teams are audited."
          />
        </div>
      ) : (
        <div className="risk-columns">
          {TIERS.map((tier) => {
            const tierAlerts = alerts.filter((a) => a.priority === tier);
            return (
              <div className={`risk-column risk-column-${tier.toLowerCase()}`} key={tier}>
                <div className="risk-column-header">
                  <span>{tier}</span>
                  <span className="risk-column-count">{tierAlerts.length}</span>
                </div>

                {tierAlerts.length === 0 ? (
                  <p className="muted risk-column-empty">No teams in this tier.</p>
                ) : (
                  tierAlerts.map((alert) => (
                    <AlertCard
                      key={alert.team}
                      alert={alert}
                      resolved={resolvedTeams.includes(alert.team)}
                      onResolve={onResolve}
                      onEscalate={onEscalate}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default TeamRisksPage;
