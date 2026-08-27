const PARTICIPANT_NAV = [
  { id: "overview", label: "Overview", icon: "▢" },
  { id: "concierge", label: "AI Concierge", icon: "◈" },
  { id: "matcher", label: "Team Matcher", icon: "◎" },
  { id: "auditor", label: "Submission Auditor", icon: "◒" },
];

const ORGANIZER_NAV = [
  { id: "overview", label: "Overview", icon: "▢" },
  { id: "risks", label: "Team Risks", icon: "◒" },
  { id: "alerts", label: "Agent Alerts", icon: "◈" },
  { id: "activity", label: "Activity Feed", icon: "≡" },
  { id: "concierge", label: "AI Concierge", icon: "◎" },
  { id: "auditor", label: "Submission Monitor", icon: "◑" },
];

function Sidebar({ role, activePage, onNavigate, onSwitchRole, agentOnline }) {
  const items = role === "organizer" ? ORGANIZER_NAV : PARTICIPANT_NAV;

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <div className="brand-mark">H</div>
          <div>
            <h1>HACKMIND</h1>
            <p>Autonomous Hackathon Ops</p>
          </div>
        </div>

        <div className="role-pill">
          {role === "organizer" ? "Organizer Mode" : "Participant Mode"}
        </div>

        <nav>
          {items.map((item) => (
            <button
              key={item.id}
              className={activePage === item.id ? "active" : ""}
              onClick={() => onNavigate(item.id)}
              aria-current={activePage === item.id ? "page" : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button className="switch-role-btn" onClick={onSwitchRole}>
          ⇄ Switch role
        </button>

        <div className={`status ${agentOnline ? "" : "status-offline"}`}>
          <span className="dot"></span>
          {agentOnline ? "Agent Online" : "Backend Unreachable"}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
