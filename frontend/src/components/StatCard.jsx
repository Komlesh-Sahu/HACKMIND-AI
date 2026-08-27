function StatCard({ label, value, hint, tone }) {
  return (
    <div className={`card stat-card${tone ? ` stat-card-${tone}` : ""}`}>
      <span className="stat-card-label">{label}</span>
      <strong className="stat-card-value">{value}</strong>
      {hint && <small className="stat-card-hint">{hint}</small>}
    </div>
  );
}

export default StatCard;
