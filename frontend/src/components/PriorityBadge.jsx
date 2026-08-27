function PriorityBadge({ priority }) {
  const value = (priority || "LOW").toString();

  return (
    <span className={`priority-badge ${value.toLowerCase()}`}>
      {value.toUpperCase()}
    </span>
  );
}

export default PriorityBadge;
