// =============================================================
// HACKMIND AI — API SERVICE LAYER
//
// This file only centralizes the fetch calls that already existed
// in the original App.jsx. Endpoints, methods, and payload shapes
// are UNCHANGED from the working backend contract:
//
//   POST /concierge/ask
//   POST /auditor/audit
//   POST /matcher/match
//   POST /agent/analyze
// =============================================================

const BASE_URL = "http://127.0.0.1:8000";

async function postJSON(path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || `Request to ${path} failed`);
  }

  return data;
}

// =============================
// AI CONCIERGE
// =============================

export function askConcierge(question) {
  return postJSON("/concierge/ask", { question });
}

// =============================
// SUBMISSION AUDITOR
// =============================

export function auditSubmission({
  teamName,
  githubUrl,
  demoUrl,
  hasReadme,
  problemStatement,
}) {
  return postJSON("/auditor/audit", {
    team_name: teamName,
    github_url: githubUrl || null,
    demo_url: demoUrl || null,
    readme: hasReadme,
    problem_statement: problemStatement || null,
  });
}

// =============================
// TEAM MATCHER
//
// The candidate pool is kept identical to the original
// implementation — this is not a new backend contract, just
// the same hardcoded candidates the working version sent.
// =============================

const DEFAULT_CANDIDATES = [
  { name: "Aman", skills: ["React", "UI/UX"], domain: "AI" },
  { name: "Priya", skills: ["Python", "ML"], domain: "AI" },
  { name: "Rahul", skills: ["Node.js", "MongoDB"], domain: "Web" },
];

export function matchTeammates({ name, skills, domain }) {
  return postJSON("/matcher/match", {
    participant: {
      name,
      skills,
      domain,
    },
    candidates: DEFAULT_CANDIDATES,
  });
}

// =============================
// AGENT CORE
// =============================

export function analyzeAgent({ minutesToDeadline, submissions }) {
  return postJSON("/agent/analyze", {
    minutes_to_deadline: Number(minutesToDeadline),
    submissions,
  });
}

// Convenience wrapper used by the auditor -> agent automatic flow
export function analyzeAuditedTeam({ minutesToDeadline, team, missing }) {
  return analyzeAgent({
    minutesToDeadline,
    submissions: [{ team, missing }],
  });
}

// Demo sweep used by "Run Autonomous Agent" on the organizer side.
// Same hardcoded submission set as the original implementation.
export function runAgentSweep({ minutesToDeadline }) {
  return analyzeAgent({
    minutesToDeadline,
    submissions: [
      { team: "Team Alpha", missing: ["README", "Demo video"] },
      { team: "Team Beta", missing: [] },
      { team: "Team Gamma", missing: ["GitHub repository"] },
    ],
  });
}
