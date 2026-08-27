function EmptyState({ icon = "◇", title, description }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">{icon}</span>
      {title && <p className="empty-state-title">{title}</p>}
      {description && <p className="empty-state-desc">{description}</p>}
    </div>
  );
}

export default EmptyState;
