import { useState } from "react";
import EmptyState from "../components/EmptyState.jsx";

const SUGGESTED_QUESTIONS = [
  "Do I need a README?",
  "What are the submission requirements?",
  "What should the demo include?",
];

function ConciergePage({ messages, onSend, loading }) {
  const [question, setQuestion] = useState("");

  const submit = (text) => {
    const value = (text ?? question).trim();
    if (!value || loading) return;
    onSend(value);
    setQuestion("");
  };

  return (
    <section className="page">
      <div className="page-header">
        <p className="eyebrow">AI CONCIERGE</p>
        <h2>Ask HACKMIND</h2>
        <p className="muted">
          Answers are grounded in official event documents — rules, deadlines and the README.
        </p>
      </div>

      <div className="card chat-panel">
        <div className="chat-thread">
          {messages.length === 0 && (
            <EmptyState
              icon="◈"
              title="Ask your first question"
              description="HACKMIND will answer using the official rules, README and deadline documents."
            />
          )}

          {messages.map((message) => (
            <div key={message.id} className={`chat-bubble chat-bubble-${message.role}`}>
              <p>{message.text}</p>
              {message.source && (
                <span className="source-badge">Source: {message.source}</span>
              )}
            </div>
          ))}

          {loading && (
            <div className="chat-bubble chat-bubble-assistant chat-bubble-typing">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          )}
        </div>

        <div className="suggested-questions">
          {SUGGESTED_QUESTIONS.map((suggestion) => (
            <button key={suggestion} onClick={() => submit(suggestion)} disabled={loading}>
              {suggestion}
            </button>
          ))}
        </div>

        <div className="chat-input-row">
          <input
            type="text"
            placeholder="Ask about rules, deadlines, README..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            aria-label="Ask HACKMIND a question"
          />
          <button className="btn-primary" onClick={() => submit()} disabled={loading || !question.trim()}>
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ConciergePage;
