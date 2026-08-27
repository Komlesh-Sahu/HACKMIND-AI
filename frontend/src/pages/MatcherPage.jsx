import { useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";

const DOMAINS = [
  { value: "AI", label: "AI / ML" },
  { value: "Web", label: "Web Development" },
  { value: "IoT", label: "IoT" },
  { value: "Blockchain", label: "Blockchain" },
  { value: "Cybersecurity", label: "Cybersecurity" },
];

function MatcherPage({ results, loading, onFindMatches }) {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [domain, setDomain] = useState("AI");
  const [touched, setTouched] = useState(false);

  const nameError = touched && !name.trim() ? "Enter your name to continue." : "";
  const skillsError = touched && !skills.trim() ? "List at least one skill." : "";

  const submit = () => {
    setTouched(true);
    if (!name.trim() || !skills.trim()) return;

    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    onFindMatches({ name: name.trim(), skills: skillList, domain });
  };

  return (
    <section className="page">
      <div className="page-header">
        <p className="eyebrow">AI TEAM MATCHER</p>
        <h2>Find Your Best Teammate</h2>
        <p className="muted">
          HACKMIND analyzes skills and domain preferences to recommend complementary teammates.
        </p>
      </div>

      <div className="split-grid">
        <div className="card">
          <h3 className="card-title">Your profile</h3>

          <div className="form-stack">
            <div className="field">
              <label htmlFor="matcher-name">Participant name</label>
              <input
                id="matcher-name"
                type="text"
                placeholder="e.g. Ananya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {nameError && <span className="field-error">{nameError}</span>}
            </div>

            <div className="field">
              <label htmlFor="matcher-skills">Skills</label>
              <input
                id="matcher-skills"
                type="text"
                placeholder="Python, ML, NLP"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
              <span className="field-hint">Separate skills with commas.</span>
              {skillsError && <span className="field-error">{skillsError}</span>}
            </div>

            <div className="field">
              <label htmlFor="matcher-domain">Domain</label>
              <select id="matcher-domain" value={domain} onChange={(e) => setDomain(e.target.value)}>
                {DOMAINS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn-primary" onClick={submit} disabled={loading}>
              {loading ? "Finding Matches..." : "Find Best Match"}
            </button>
          </div>
        </div>

        <div className="card match-results-panel">
          <h3 className="card-title">Recommended teammates</h3>

          {loading && <LoadingState label="Scoring compatible teammates..." />}

          {!loading && results.length === 0 && (
            <EmptyState
              icon="◎"
              title="No matches yet"
              description="Enter your skills to discover compatible teammates."
            />
          )}

          {!loading &&
            results.map((match, index) => (
              <div className="match-card" key={match.candidate ?? index}>
                <div className="match-top">
                  <div>
                    <span className="match-rank">#{index + 1}</span>
                    <strong>{match.candidate}</strong>
                  </div>
                  <span className="match-score">{match.score}% Match</span>
                </div>

                <p>{match.reason}</p>

                {match.complementary_skills?.length > 0 && (
                  <div className="skill-tags">
                    {match.complementary_skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default MatcherPage;
