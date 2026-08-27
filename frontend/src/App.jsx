import { useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  // =============================
  // HACKMIND UNIFIED AGENT STATES
  // =============================

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [source, setSource] = useState("");
  const [agentMeta, setAgentMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  // =============================
  // SUBMISSION AUDITOR STATES
  // =============================

  const [teamName, setTeamName] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [hasReadme, setHasReadme] = useState(false);
  const [problemStatement, setProblemStatement] = useState("");
  const [submissionDomain, setSubmissionDomain] = useState("AI");
  const [auditResult, setAuditResult] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);

  // =============================
  // TEAM MATCHER STATES
  // =============================

  const [participantName, setParticipantName] = useState("");
  const [participantSkills, setParticipantSkills] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [participantDomain, setParticipantDomain] = useState("AI");
  const [matchResults, setMatchResults] = useState([]);
  const [matchLoading, setMatchLoading] = useState(false);

  // =============================
  // AGENT CORE STATES
  // =============================

  const [minutesToDeadline, setMinutesToDeadline] = useState(20);
  const [agentAlerts, setAgentAlerts] = useState([]);
  const [agentLoading, setAgentLoading] = useState(false);

  // =============================
  // SIDEBAR NAVIGATION STATE
  // =============================

  const [activeSection, setActiveSection] = useState("overview");

  // =============================
  // SIDEBAR NAVIGATION
  // =============================

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setActiveSection(id);
    }
  };

  // =============================
  // HACKMIND UNIFIED AGENT
  // =============================

  const askHackmind = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");
    setSource("");
    setAgentMeta(null);

    try {
      const response = await fetch(
        `${API_URL}/agent/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: question,

            context: {
              // Team Matcher context
              participant_name: participantName,

              participant_skills: participantSkills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean),

              required_skills: requiredSkills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean),

              participant_domain: participantDomain,

              candidates: [
                {
                  name: "Aman",
                  skills: ["React", "UI/UX", "Figma"],
                  domain: "AI",
                },
                {
                  name: "Priya",
                  skills: ["Python", "ML", "Data Analysis"],
                  domain: "AI",
                },
                {
                  name: "Rahul",
                  skills: ["Node.js", "MongoDB", "Express"],
                  domain: "Web",
                },
                {
                  name: "Sneha",
                  skills: ["IoT", "Embedded Systems", "Arduino"],
                  domain: "IoT",
                },
                {
                  name: "Karan",
                  skills: ["Solidity", "Blockchain", "Web3"],
                  domain: "Blockchain",
                },
                {
                  name: "Ananya",
                  skills: ["Cybersecurity", "Penetration Testing", "Linux"],
                  domain: "Cybersecurity",
                },
                {
                  name: "Riya",
                  skills: ["Data Science", "Machine Learning", "Pandas"],
                  domain: "AI",
                },
                {
                  name: "Vikram",
                  skills: ["Cloud Computing", "AWS", "Docker"],
                  domain: "Web",
                },
                {
                  name: "Arjun",
                  skills: ["FastAPI", "Python", "Backend"],
                  domain: "AI",
                },
                {
                  name: "Neha",
                  skills: ["NLP", "LLM", "Python"],
                  domain: "AI",
                },
                {
                  name: "Rohan",
                  skills: ["Networking", "Linux", "Security"],
                  domain: "Cybersecurity",
                },
                {
                  name: "Ishita",
                  skills: ["React", "JavaScript", "Frontend"],
                  domain: "Web",
                },
                {
                  name: "Aditya",
                  skills: ["TensorFlow", "Computer Vision", "Deep Learning"],
                  domain: "AI",
                },
                {
                  name: "Meera",
                  skills: ["UI/UX", "Figma", "Product Design"],
                  domain: "Web",
                },
                {
                  name: "Soham",
                  skills: ["Flutter", "Firebase", "Mobile Development"],
                  domain: "Web",
                },
                {
                  name: "Pooja",
                  skills: ["SQL", "Data Analysis", "Power BI"],
                  domain: "AI",
                },
                {
                  name: "Aryan",
                  skills: ["Java", "Spring Boot", "Backend"],
                  domain: "Web",
                },
                {
                  name: "Tanvi",
                  skills: ["NLP", "Prompt Engineering", "LLM"],
                  domain: "AI",
                },
                {
                  name: "Dev",
                  skills: ["Docker", "Kubernetes", "DevOps"],
                  domain: "Web",
                },
                {
                  name: "Nisha",
                  skills: ["Arduino", "Sensors", "IoT"],
                  domain: "IoT",
                },
              ],

              // Submission Auditor context
              team_name: teamName,
              github_url: githubUrl || null,
              demo_url: demoUrl || null,
              readme: hasReadme,
              problem_statement: problemStatement || null,
              submission_domain: submissionDomain || null,

              // Proactive risk context
              minutes_to_deadline: Number(minutesToDeadline),
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const result = data.result;

      setAnswer(
        result?.answer ||
          "HACKMIND completed the request but returned no answer."
      );

      setSource(result?.source || "");

      setAgentMeta({
        intent: result?.intent || "UNKNOWN",
        tool: result?.tool || "N/A",
        decision: result?.decision || "N/A",
        action: result?.action || "N/A",
        escalate: result?.escalate ?? false,
        toolExecuted: result?.tool_executed ?? null,
        retrievalScore: result?.retrieval_score ?? null,
      });

      // If the unified Agent executed Team Matcher,
      // reflect the result in the existing matcher panel.
      if (Array.isArray(result?.matches)) {
        setMatchResults(result.matches.slice(0, 5));
      }

      // If the unified Agent executed Submission Auditor,
      // reflect the result in the existing auditor panel.
      if (result?.audit) {
        setAuditResult(result.audit);
      }

      // If the unified Agent produced a deadline-risk alert,
      // reflect it in the organizer alert panel.
      if (result?.risk_alert) {
        setAgentAlerts((previousAlerts) => {
          const otherTeams = previousAlerts.filter(
            (alert) => alert.team !== result.risk_alert.team
          );

          return [...otherTeams, result.risk_alert].sort(
            (a, b) => b.urgency_score - a.urgency_score
          );
        });
      }
    } catch (error) {
      console.error("HACKMIND Agent error:", error);
      setAnswer("Could not connect to the HACKMIND Agent backend.");
      setSource("");
      setAgentMeta(null);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // AUTOMATIC AUDITOR → AGENT
  // =============================

  const analyzeAuditedTeam = async (
    team,
    missingItems,
    invalidItems = []
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/agent/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            minutes_to_deadline: Number(minutesToDeadline),

            submissions: [
              {
                team: team,
                missing: missingItems,
                invalid: invalidItems,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Automatic agent analysis failed");
      }

      setAgentAlerts((previousAlerts) => {
        const otherTeams = previousAlerts.filter(
          (alert) => alert.team !== team
        );

        return [...otherTeams, ...data.alerts].sort(
          (a, b) => b.urgency_score - a.urgency_score
        );
      });
    } catch (error) {
      console.error("Automatic Agent Error:", error);
    }
  };

  // =============================
  // SUBMISSION AUDITOR
  // =============================

  const auditSubmission = async () => {
    if (!teamName.trim()) return;

    setAuditLoading(true);
    setAuditResult(null);

    try {
      const response = await fetch(
        `${API_URL}/auditor/audit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            team_name: teamName,
            github_url: githubUrl || null,
            demo_url: demoUrl || null,
            readme: hasReadme,
            problem_statement: problemStatement || null,
            domain: submissionDomain || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Audit request failed");
      }

      setAuditResult(data);

      await analyzeAuditedTeam(
        data.team,
        data.missing || [],
        data.invalid || []
      );
    } catch (error) {
      console.error(error);

      setAuditResult({
        complete: false,
        missing: [],
        invalid: [],
        checks: null,
        status: "Could not connect to Submission Auditor.",
      });
    } finally {
      setAuditLoading(false);
    }
  };

  // =============================
  // TEAM MATCHER
  // =============================

  const findMatches = async () => {
    if (
      !participantName.trim() ||
      !participantSkills.trim() ||
      !requiredSkills.trim()
    ) {
      return;
    }

    setMatchLoading(true);
    setMatchResults([]);

    const skills = participantSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const requiredSkillList = requiredSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    try {
      const response = await fetch(
        `${API_URL}/matcher/match`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            participant: {
              name: participantName,
              skills: skills,
              domain: participantDomain,
            },

            required_skills: requiredSkillList,

            candidates: [
              {
                name: "Aman",
                skills: ["React", "UI/UX", "Figma"],
                domain: "AI",
              },
              {
                name: "Priya",
                skills: ["Python", "ML", "Data Analysis"],
                domain: "AI",
              },
              {
                name: "Rahul",
                skills: ["Node.js", "MongoDB", "Express"],
                domain: "Web",
              },
              {
                name: "Sneha",
                skills: ["IoT", "Embedded Systems", "Arduino"],
                domain: "IoT",
              },
              {
                name: "Karan",
                skills: ["Solidity", "Blockchain", "Web3"],
                domain: "Blockchain",
              },
              {
                name: "Ananya",
                skills: ["Cybersecurity", "Penetration Testing", "Linux"],
                domain: "Cybersecurity",
              },
              {
                name: "Riya",
                skills: ["Data Science", "Machine Learning", "Pandas"],
                domain: "AI",
              },
              {
                name: "Vikram",
                skills: ["Cloud Computing", "AWS", "Docker"],
                domain: "Web",
              },
              {
                name: "Arjun",
                skills: ["FastAPI", "Python", "Backend"],
                domain: "AI",
              },
              {
                name: "Neha",
                skills: ["NLP", "LLM", "Python"],
                domain: "AI",
              },
              {
                name: "Rohan",
                skills: ["Networking", "Linux", "Security"],
                domain: "Cybersecurity",
              },
              {
                name: "Ishita",
                skills: ["React", "JavaScript", "Frontend"],
                domain: "Web",
              },
              {
                name: "Aditya",
                skills: ["TensorFlow", "Computer Vision", "Deep Learning"],
                domain: "AI",
              },
              {
                name: "Meera",
                skills: ["UI/UX", "Figma", "Product Design"],
                domain: "Web",
              },
              {
                name: "Soham",
                skills: ["Flutter", "Firebase", "Mobile Development"],
                domain: "Web",
              },
              {
                name: "Pooja",
                skills: ["SQL", "Data Analysis", "Power BI"],
                domain: "AI",
              },
              {
                name: "Aryan",
                skills: ["Java", "Spring Boot", "Backend"],
                domain: "Web",
              },
              {
                name: "Tanvi",
                skills: ["NLP", "Prompt Engineering", "LLM"],
                domain: "AI",
              },
              {
                name: "Dev",
                skills: ["Docker", "Kubernetes", "DevOps"],
                domain: "Web",
              },
              {
                name: "Nisha",
                skills: ["Arduino", "Sensors", "IoT"],
                domain: "IoT",
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Matcher request failed");
      }

      setMatchResults(data.matches.slice(0, 5));
    } catch (error) {
      console.error(error);
      setMatchResults([]);
    } finally {
      setMatchLoading(false);
    }
  };

  // =============================
  // AGENT CORE
  // =============================

  const runAgent = async () => {
    setAgentLoading(true);
    setAgentAlerts([]);

    try {
      const response = await fetch(
        `${API_URL}/agent/analyze`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            minutes_to_deadline: Number(minutesToDeadline),

            submissions: [
              {
                team: "Team Alpha",
                missing: ["README", "Demo video"],
              },

              {
                team: "Team Beta",
                missing: [],
              },

              {
                team: "Team Gamma",
                missing: ["GitHub repository"],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Agent request failed");
      }

      setAgentAlerts(data.alerts);
    } catch (error) {
      console.error(error);
      setAgentAlerts([]);
    } finally {
      setAgentLoading(false);
    }
  };

  const activeRisk = agentAlerts[0] || null;

  const auditIssueCount =
    (auditResult?.missing?.length || 0) +
    (auditResult?.invalid?.length || 0);

  const agentStatus = loading
    ? "RUNNING"
    : answer
      ? "ACTIVE"
      : "READY";

  const traceReason = auditResult
    ? `${auditIssueCount} issue${auditIssueCount === 1 ? "" : "s"} detected`
    : agentMeta
      ? "Context evaluated"
      : "Waiting for request";

  return (
    <div className="app">
      {/* ==================================================
          SIDEBAR
      ================================================== */}
      <aside className="sidebar">
        <div>
          <div className="brand-block">
            <div className="brand-mark">H</div>

            <div>
              <h1>HACKMIND AI</h1>
              <p>Autonomous Event Operations</p>
            </div>
          </div>

          <nav className="nav-stack">
            <button
              className={activeSection === "overview" ? "active" : ""}
              onClick={() => scrollToSection("overview")}
            >
              <span className="nav-icon">◈</span>
              Command Center
            </button>

            <button
              className={activeSection === "concierge" ? "active" : ""}
              onClick={() => scrollToSection("concierge")}
            >
              <span className="nav-icon">⌁</span>
              HACKMIND Agent
            </button>

            <button
              className={activeSection === "agent" ? "active" : ""}
              onClick={() => scrollToSection("agent")}
            >
              <span className="nav-icon">⚠</span>
              Risk Monitor
            </button>

            <button
              className={activeSection === "auditor" ? "active" : ""}
              onClick={() => scrollToSection("auditor")}
            >
              <span className="nav-icon">✓</span>
              Submission Auditor
            </button>

            <button
              className={activeSection === "matcher" ? "active" : ""}
              onClick={() => scrollToSection("matcher")}
            >
              <span className="nav-icon">◇</span>
              Team Matcher
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="system-status">
            <span className="dot"></span>
            <div>
              <strong>Agent Online</strong>
              <small>FastAPI connected</small>
            </div>
          </div>
        </div>
      </aside>

      {/* ==================================================
          MAIN COMMAND CENTER
      ================================================== */}
      <main className="main" id="overview">
        <header className="topbar">
          <div>
            <p className="eyebrow">HACKMIND / COMMAND CENTER</p>
            <h2>Learnathon 5.0 Operations</h2>
            <p className="topbar-subtitle">
              Unified event intelligence, risk detection and intervention.
            </p>
          </div>

          <div className="topbar-actions">
            <div className="deadline-chip">
              <span>Deadline context</span>
              <strong>{minutesToDeadline} min</strong>
            </div>

            <div className="live-badge">
              <span className="live-dot"></span>
              LIVE
            </div>
          </div>
        </header>

        {/* ==================================================
            HERO AGENT COMMAND
        ================================================== */}
        <section className="agent-command card" id="concierge">
          <div className="command-head">
            <div>
              <p className="eyebrow">UNIFIED AI AGENT</p>
              <h3>What should HACKMIND do?</h3>
              <p className="muted">
                Ask about event rules, find a teammate, audit a submission,
                or resolve an operational issue.
              </p>
            </div>

            <span className={`agent-state-pill ${agentStatus.toLowerCase()}`}>
              {agentStatus}
            </span>
          </div>

          <div className="command-input-row">
            <input
              type="text"
              placeholder="Ask HACKMIND: check my submission, find a teammate, when is judging day..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  askHackmind();
                }
              }}
            />

            <button onClick={askHackmind} disabled={loading}>
              {loading ? "Executing..." : "Execute →"}
            </button>
          </div>

          <div className="command-meta-row">
            <span>Verified event knowledge</span>
            <span>Tool routing enabled</span>
            <span>Escalation policy active</span>
          </div>

          {answer && (
            <div className={`agent-answer ${agentMeta?.escalate ? "escalated" : ""}`}>
              <div className="answer-topline">
                <span className="answer-kicker">
                  {agentMeta?.escalate ? "ESCALATION" : "AGENT RESPONSE"}
                </span>

                {source && (
                  <span className="verified-source">
                    ✓ Verified source · {source}
                  </span>
                )}
              </div>

              <p>{answer}</p>
            </div>
          )}
        </section>

        {/* ==================================================
            LIVE STATE
        ================================================== */}
        <section className="state-grid">
          <div className="metric-card">
            <span>Agent Status</span>
            <strong>{agentStatus}</strong>
            <small>Unified orchestration layer</small>
          </div>

          <div className={`metric-card ${agentAlerts.length > 0 ? "risk" : ""}`}>
            <span>Active Risks</span>
            <strong>{agentAlerts.length}</strong>
            <small>Current organizer queue</small>
          </div>

          <div className="metric-card">
            <span>Deadline Context</span>
            <strong>{minutesToDeadline}m</strong>
            <small>Used by the risk engine</small>
          </div>

          <div className="metric-card">
            <span>Knowledge Mode</span>
            <strong>VERIFIED</strong>
            <small>Grounded event sources</small>
          </div>
        </section>

        {/* ==================================================
            AGENT TRACE + MONITOR
        ================================================== */}
        <section className="operations-grid" id="agent">
          <div className="card trace-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">AGENT EXECUTION</p>
                <h3>Decision Trace</h3>
              </div>

              <span className={`decision-chip ${agentMeta?.escalate ? "danger" : ""}`}>
                {agentMeta?.decision || "WAITING"}
              </span>
            </div>

            <div className="trace-flow">
              <div className="trace-node">
                <span className="trace-number">01</span>
                <small>OBSERVE</small>
                <strong>{question ? "Request received" : "Awaiting input"}</strong>
              </div>

              <div className="trace-arrow">→</div>

              <div className="trace-node">
                <span className="trace-number">02</span>
                <small>UNDERSTAND</small>
                <strong>{agentMeta?.intent || "—"}</strong>
              </div>

              <div className="trace-arrow">→</div>

              <div className="trace-node">
                <span className="trace-number">03</span>
                <small>SELECT TOOL</small>
                <strong>{agentMeta?.tool || "—"}</strong>
              </div>

              <div className="trace-arrow">→</div>

              <div className="trace-node">
                <span className="trace-number">04</span>
                <small>REASON</small>
                <strong>{traceReason}</strong>
              </div>

              <div className="trace-arrow">→</div>

              <div className="trace-node">
                <span className="trace-number">05</span>
                <small>ACT</small>
                <strong>
                  {agentMeta
                    ? agentMeta.escalate
                      ? "Escalate"
                      : "Resolve"
                    : "—"}
                </strong>
              </div>
            </div>

            {agentMeta && (
              <div className="trace-summary">
                <div>
                  <small>Decision</small>
                  <strong>{agentMeta.decision}</strong>
                </div>

                <div>
                  <small>Status</small>
                  <strong className={agentMeta.escalate ? "danger-text" : "success-text"}>
                    {agentMeta.escalate ? "ESCALATED" : "RESOLVED"}
                  </strong>
                </div>

                <div className="trace-summary-action">
                  <small>Action</small>
                  <strong>{agentMeta.action}</strong>
                </div>
              </div>
            )}
          </div>

          <div className="card monitor-panel">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">RISK ENGINE</p>
                <h3>Event Monitor</h3>
              </div>
            </div>

            <label className="field-label">
              Minutes to deadline
            </label>

            <div className="monitor-control">
              <input
                type="number"
                min="0"
                value={minutesToDeadline}
                onChange={(e) => setMinutesToDeadline(e.target.value)}
              />

              <button
                className="secondary-button"
                onClick={runAgent}
                disabled={agentLoading}
              >
                {agentLoading ? "Analyzing..." : "Analyze State"}
              </button>
            </div>

            <div className="monitor-details">
              <div>
                <span>≤ 30m</span>
                <strong>CRITICAL</strong>
              </div>

              <div>
                <span>≤ 60m</span>
                <strong>HIGH</strong>
              </div>

              <div>
                <span>≤ 180m</span>
                <strong>MEDIUM</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            PRIORITY OPERATIONS QUEUE
        ================================================== */}
        <section className="card risk-queue">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ORGANIZER OPERATIONS QUEUE</p>
              <h3>Priority Interventions</h3>
            </div>

            <span className="alert-count">
              {agentAlerts.length} active
            </span>
          </div>

          {agentAlerts.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <div>
                <strong>No active submission risks</strong>
                <p>
                  Run an audit or ask HACKMIND to inspect a submission.
                </p>
              </div>
            </div>
          )}

          <div className="risk-list">
            {agentAlerts.map((alert) => (
              <article
                className={`risk-row ${alert.priority.toLowerCase()}`}
                key={alert.team}
              >
                <div className="risk-main">
                  <div className="risk-title-row">
                    <span className={`priority-badge ${alert.priority.toLowerCase()}`}>
                      {alert.priority}
                    </span>

                    <strong>{alert.team}</strong>
                  </div>

                  <div className="risk-issues">
                    {alert.missing && alert.missing.length > 0 && (
                      <span>
                        Missing · {alert.missing.join(" · ")}
                      </span>
                    )}

                    {alert.invalid && alert.invalid.length > 0 && (
                      <span>
                        Invalid · {alert.invalid.join(" · ")}
                      </span>
                    )}
                  </div>

                  <p>{alert.action}</p>
                </div>

                <div className="risk-meta">
                  <div>
                    <small>Urgency</small>
                    <strong>{alert.urgency_score}</strong>
                  </div>

                  <div>
                    <small>Deadline</small>
                    <strong>{minutesToDeadline}m</strong>
                  </div>

                  {alert.escalate && (
                    <span className="escalation-label">
                      Escalation required
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ==================================================
            SUBMISSION AUDITOR
        ================================================== */}
        <section className="tool-section card" id="auditor">
          <div className="tool-header">
            <div>
              <p className="eyebrow">SPECIALIST TOOL</p>
              <h3>Submission Auditor</h3>
              <p className="muted">
                Validate required submission fields and supplied URL formats
                before the deadline.
              </p>
            </div>

            <span className="tool-badge">AUDITOR V2</span>
          </div>

          <div className="tool-grid">
            <div className="form-panel">
              <div className="field-group">
                <label>Team name</label>
                <input
                  type="text"
                  placeholder="Team Gamma"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>GitHub repository</label>
                <input
                  type="text"
                  placeholder="https://github.com/team/project"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Demo URL</label>
                <input
                  type="text"
                  placeholder="https://youtube.com/..."
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Problem statement</label>
                <input
                  type="text"
                  placeholder="Autonomous Hackathon Concierge"
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Domain / track</label>
                <select
                  value={submissionDomain}
                  onChange={(e) => setSubmissionDomain(e.target.value)}
                >
                  <option value="AI">AI / ML</option>
                  <option value="Web">Web Development</option>
                  <option value="IoT">IoT</option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={hasReadme}
                  onChange={(e) => setHasReadme(e.target.checked)}
                />
                <span>
                  <strong>README included</strong>
                  <small>Required submission documentation</small>
                </span>
              </label>

              <button
                className="primary-action"
                onClick={auditSubmission}
                disabled={auditLoading}
              >
                {auditLoading ? "Auditing..." : "Run Audit →"}
              </button>
            </div>

            <div className="validation-panel">
              {!auditResult && (
                <div className="empty-validation">
                  <span className="validation-icon">✓</span>
                  <h4>Ready to validate</h4>
                  <p>
                    Submission checks will appear here after an audit.
                  </p>
                </div>
              )}

              {auditResult && (
                <>
                  <div className="validation-summary">
                    <div>
                      <span
                        className={
                          auditResult.complete
                            ? "audit-status success-status"
                            : "audit-status danger-status"
                        }
                      >
                        {auditResult.complete
                          ? "SUBMISSION READY"
                          : "SUBMISSION RISK"}
                      </span>

                      <h4>{auditResult.status}</h4>
                    </div>

                    <strong className="issue-total">
                      {auditIssueCount}
                      <small>issues</small>
                    </strong>
                  </div>

                  {auditResult.checks && (
                    <div className="validation-list">
                      <div className="validation-row">
                        <span
                          className={
                            auditResult.checks.github?.present &&
                            auditResult.checks.github?.valid_format
                              ? "check-icon pass"
                              : "check-icon fail"
                          }
                        >
                          {auditResult.checks.github?.present &&
                          auditResult.checks.github?.valid_format
                            ? "✓"
                            : "×"}
                        </span>

                        <div>
                          <strong>GitHub repository</strong>
                          <small>
                            {auditResult.checks.github?.present
                              ? auditResult.checks.github?.valid_format
                                ? "Valid GitHub URL format"
                                : "Invalid GitHub URL format"
                              : "Missing"}
                          </small>
                        </div>
                      </div>

                      <div className="validation-row">
                        <span
                          className={
                            auditResult.checks.demo?.present &&
                            auditResult.checks.demo?.valid_format
                              ? "check-icon pass"
                              : "check-icon fail"
                          }
                        >
                          {auditResult.checks.demo?.present &&
                          auditResult.checks.demo?.valid_format
                            ? "✓"
                            : "×"}
                        </span>

                        <div>
                          <strong>Demo link</strong>
                          <small>
                            {auditResult.checks.demo?.present
                              ? auditResult.checks.demo?.valid_format
                                ? "Valid URL format"
                                : "Invalid URL format"
                              : "Missing"}
                          </small>
                        </div>
                      </div>

                      <div className="validation-row">
                        <span className={auditResult.checks.readme?.present ? "check-icon pass" : "check-icon fail"}>
                          {auditResult.checks.readme?.present ? "✓" : "×"}
                        </span>

                        <div>
                          <strong>README</strong>
                          <small>
                            {auditResult.checks.readme?.present
                              ? "Present"
                              : "Missing"}
                          </small>
                        </div>
                      </div>

                      <div className="validation-row">
                        <span className={auditResult.checks.problem_statement?.present ? "check-icon pass" : "check-icon fail"}>
                          {auditResult.checks.problem_statement?.present
                            ? "✓"
                            : "×"}
                        </span>

                        <div>
                          <strong>Problem statement</strong>
                          <small>
                            {auditResult.checks.problem_statement?.present
                              ? "Present"
                              : "Missing"}
                          </small>
                        </div>
                      </div>

                      <div className="validation-row">
                        <span className={auditResult.checks.domain_track?.present ? "check-icon pass" : "check-icon fail"}>
                          {auditResult.checks.domain_track?.present
                            ? "✓"
                            : "×"}
                        </span>

                        <div>
                          <strong>Domain / track</strong>
                          <small>
                            {auditResult.checks.domain_track?.present
                              ? "Present"
                              : "Missing"}
                          </small>
                        </div>
                      </div>
                    </div>
                  )}

                  {(auditResult.missing?.length > 0 ||
                    auditResult.invalid?.length > 0) && (
                    <div className="issue-box">
                      {auditResult.missing?.length > 0 && (
                        <p>
                          <strong>Missing:</strong>{" "}
                          {auditResult.missing.join(", ")}
                        </p>
                      )}

                      {auditResult.invalid?.length > 0 && (
                        <p>
                          <strong>Invalid:</strong>{" "}
                          {auditResult.invalid.join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* ==================================================
            TEAM MATCHER
        ================================================== */}
        <section className="tool-section card" id="matcher">
          <div className="tool-header">
            <div>
              <p className="eyebrow">SPECIALIST TOOL</p>
              <h3>AI Team Matcher</h3>
              <p className="muted">
                Rank candidates by complementary skills and domain alignment.
              </p>
            </div>

            <span className="tool-badge simulated">
              SIMULATED DATASET
            </span>
          </div>

          <div className="tool-grid matcher-layout">
            <div className="form-panel">
              <div className="field-group">
                <label>Participant name</label>
                <input
                  type="text"
                  placeholder="Participant name"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Current skills</label>
                <input
                  type="text"
                  placeholder="Python, ML, NLP"
                  value={participantSkills}
                  onChange={(e) => setParticipantSkills(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Skills needed</label>
                <input
                  type="text"
                  placeholder="React, UI/UX"
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Domain preference</label>
                <select
                  value={participantDomain}
                  onChange={(e) => setParticipantDomain(e.target.value)}
                >
                  <option value="AI">AI / ML</option>
                  <option value="Web">Web Development</option>
                  <option value="IoT">IoT</option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>

              <button
                className="primary-action"
                onClick={findMatches}
                disabled={matchLoading}
              >
                {matchLoading ? "Ranking Candidates..." : "Find Best Match →"}
              </button>
            </div>

            <div className="match-results">
              {matchResults.length === 0 && (
                <div className="empty-validation">
                  <span className="validation-icon">◇</span>
                  <h4>No candidates ranked yet</h4>
                  <p>
                    Enter your skills and missing capabilities to run the matcher.
                  </p>
                </div>
              )}

              {matchResults.map((match, index) => (
                <article
                  className={`match-card ${index === 0 ? "best-match" : ""}`}
                  key={match.candidate}
                >
                  <div className="match-top">
                    <div>
                      <span className="match-rank">
                        {index === 0 ? "#1 BEST MATCH" : `#${index + 1}`}
                      </span>

                      <strong>{match.candidate}</strong>
                    </div>

                    <span className="match-score">
                      {match.score}/100
                      <small>compatibility</small>
                    </span>
                  </div>

                  <p>{match.reason}</p>

                  {match.complementary_skills &&
                    match.complementary_skills.length > 0 && (
                      <div className="skill-wrap">
                        <small>Adds missing capability</small>

                        <div className="skill-tags">
                          {match.complementary_skills.map((skill) => (
                            <span key={skill}>{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="domain-row">
                    <small>Domain alignment</small>
                    <strong>
                      {match.domain_match ? "Aligned ✓" : "Different domain"}
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className="product-footer">
          <span>HACKMIND AI · Autonomous Hackathon Operations</span>
          <span>React · FastAPI · TF-IDF Retrieval · Explainable Agent Routing</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
