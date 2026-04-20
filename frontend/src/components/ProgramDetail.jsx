import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { formatCost, getScoreClass, getBarClass } from './utils';

const BREAKDOWN_LABELS = {
  interestMatch: 'Interest Match',
  gpaEligibility: 'GPA Eligibility',
  budgetFit: 'Budget Fit',
  formatMatch: 'Format Match',
  durationFit: 'Duration Fit',
};

export default function ProgramDetail({ program, profile, onClose }) {
  const [explanation, setExplanation] = useState('');
  const [explLoading, setExplLoading] = useState(true);

  useEffect(() => {
    const fetchExplanation = async () => {
      try {
        setExplLoading(true);
        const res = await fetch('/api/explain-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile, program }),
        });
        const data = await res.json();
        if (data.success) setExplanation(data.explanation);
      } catch (err) {
        setExplanation('Unable to generate explanation at this time.');
      } finally {
        setExplLoading(false);
      }
    };

    fetchExplanation();
  }, [program.id]);

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const scoreClass = getScoreClass(program.matchScore);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-program-name">{program.name}</div>
            <div className="modal-score-badge">
              <span className="score-dot" />
              <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>
                {program.matchScore}% match
              </span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>
                — Your top {scoreClass === 'score-high' ? 'pick' : 'option'}
              </span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className="modal-body">

          {/* Program Info */}
          <div className="modal-section">
            <div className="modal-section-title">Program Overview</div>
            <div className="modal-meta-grid" style={{ marginBottom: '16px' }}>
              <div className="modal-meta-item">
                <div className="modal-meta-item-label">📍 Location</div>
                <div className="modal-meta-item-value">{program.location}</div>
              </div>
              <div className="modal-meta-item">
                <div className="modal-meta-item-label">🛡️ Area Safety</div>
                <div className="modal-meta-item-value">{program.safety}</div>
              </div>
              <div className="modal-meta-item">
                <div className="modal-meta-item-label">💰 Cost</div>
                <div className="modal-meta-item-value" style={
                  program.cost === 0 ? { color: 'var(--accent-secondary)' } : {}
                }>{formatCost(program.cost)}</div>
              </div>
              <div className="modal-meta-item">
                <div className="modal-meta-item-label">🖥️ Format</div>
                <div className="modal-meta-item-value" style={{ textTransform: 'capitalize' }}>
                  {program.format}
                </div>
              </div>
              <div className="modal-meta-item">
                <div className="modal-meta-item-label">⏱ Duration</div>
                <div className="modal-meta-item-value">{program.duration}</div>
              </div>
              <div className="modal-meta-item">
                <div className="modal-meta-item-label">📚 Min GPA</div>
                <div className="modal-meta-item-value">{program.minGPA}</div>
              </div>
              <div className="modal-meta-item">
                <div className="modal-meta-item-label">🎓 Eligible Grades</div>
                <div className="modal-meta-item-value">
                  {program.gradeEligibility.map(g => `${g}th`).join(', ')}
                </div>
              </div>
            </div>
            <p className="modal-description">{program.description}</p>
          </div>

          {/* Highlights */}
          <div className="modal-section">
            <div className="modal-section-title">Program Highlights</div>
            <div className="highlight-chips">
              {program.highlights.map((h) => (
                <span className="highlight-chip" key={h}>✦ {h}</span>
              ))}
            </div>
          </div>

          {/* Match Breakdown */}
          <div className="modal-section">
            <div className="modal-section-title">Compatibility Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(BREAKDOWN_LABELS).map(([key, label]) => {
                const score = program.breakdown?.[key] ?? 0;
                return (
                  <div className="breakdown-bar-item" key={key} style={{ gap: '14px' }}>
                    <div className="breakdown-bar-label" style={{ width: '130px', fontSize: '0.82rem' }}>{label}</div>
                    <div className="breakdown-bar-track" style={{ height: '7px' }}>
                      <div
                        className={`breakdown-bar-fill ${getBarClass(score)}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <div className="breakdown-bar-pct" style={{ fontSize: '0.8rem' }}>{score}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Explanation */}
          <div className="modal-section">
            <div className="modal-section-title">AI Counselor Analysis</div>
            <div className="ai-explanation-box">
              <div className="ai-explanation-header">
                <div className="ai-dot">✦</div>
                <div className="ai-explanation-label">Vantion AI — Personalized for you</div>
              </div>
              <div className="ai-explanation-content">
                {explLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="loading-spinner" style={{ width: '18px', height: '18px', margin: 0, flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      Generating your personalized analysis…
                    </span>
                  </div>
                ) : (
                  <ReactMarkdown>{explanation}</ReactMarkdown>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
