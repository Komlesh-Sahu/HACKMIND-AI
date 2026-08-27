function RoleSelection({ onSelectRole }) {
  return (
    <div className="role-selection">
      <div className="role-selection-inner">
        <div className="role-selection-header">
          <div className="brand-mark brand-mark-lg">H</div>
          <h1>HACKMIND AI</h1>
          <p className="role-selection-tagline">Autonomous Hackathon Operations</p>
          <p className="role-selection-question">What would you like to do?</p>
        </div>

        <div className="role-cards">
          <button className="role-card" onClick={() => onSelectRole("participant")}>
            <span className="role-card-icon">◈</span>
            <h2>Participant</h2>
            <p>Ask questions, find teammates and verify your submission.</p>
            <span className="role-card-cta">Enter Participant Mode →</span>
          </button>

          <button className="role-card role-card-organizer" onClick={() => onSelectRole("organizer")}>
            <span className="role-card-icon">◎</span>
            <h2>Organizer</h2>
            <p>Monitor teams, risks and autonomous agent decisions.</p>
            <span className="role-card-cta">Open Command Center →</span>
          </button>
        </div>

        <p className="role-selection-footnote">You can switch roles anytime from the sidebar.</p>
      </div>
    </div>
  );
}

export default RoleSelection;
