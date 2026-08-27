import PriorityBadge from "./PriorityBadge.jsx";

function AlertCard({ alert, onResolve, onEscalate, resolved }) {
  return (
    <div className={`alert-item priority-${(alert.priority || "").toLowerCase()}${resolved ? " alert-item-resolved" : ""}`}>
      <div className="alert-item-main">
        <div className="alert-item-top">
          <strong>{alert.team}</strong>
          <PriorityBadge priority={alert.priority} />
        </div>

        {alert.missing && alert.missing.length > 0 && (
          <p className="alert-item-missing">
            Missing: {alert.missing.join(", ")}
          </p>
        )}

        <p className="alert-item-action">{alert.action}</p>
      </div>

      <div className="alert-item-side">
        <small className="alert-item-urgency">Urgency {alert.urgency_score}</small>

        {!resolved ? (
          <div className="alert-item-buttons">
            <button className="btn-ghost btn-small" onClick={() => onEscalate?.(alert)}>
              Escalate
            </button>
            <button className="btn-primary btn-small" onClick={() => onResolve?.(alert)}>
              Resolve
            </button>
          </div>
        ) : (
          <span className="resolved-tag">✓ Resolved</span>
        )}
      </div>
    </div>
  );
}

export default AlertCard;
