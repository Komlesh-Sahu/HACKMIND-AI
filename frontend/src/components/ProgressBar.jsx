function ProgressBar({ value, tone = "accent" }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="progress-bar-track" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={`progress-bar-fill progress-bar-${tone}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export default ProgressBar;
