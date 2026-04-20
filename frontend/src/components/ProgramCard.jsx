import ReactMarkdown from 'react-markdown';
import { getScoreClass, formatCost, getBarClass, getShortFitReason } from './utils';

const BREAKDOWN_LABELS = {
  interestMatch: 'Interest',
  gpaEligibility: 'GPA',
  budgetFit: 'Budget',
  formatMatch: 'Format',
  durationFit: 'Duration',
};

export default function ProgramCard({
  program,
  rank,
  profile,
  isSaved,
  onClick,
  onToggleSave,
}) {
  const scoreClass = getScoreClass(program.matchScore);
  const scorePct = `${program.matchScore}% 0deg`;
  const shortReason = getShortFitReason(profile, program);

  const rankClass =
    rank === 1 ? 'rank-1'
    : rank === 2 ? 'rank-2'
    : rank === 3 ? 'rank-3'
    : 'rank-other';

  const handleSaveClick = (event) => {
    event.stopPropagation();
    onToggleSave();
  };

  return (
    <div className="program-card" onClick={onClick}>
      <div className="program-card-top">
        {/* Rank & Info */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 }}>
          <div className={`program-rank ${rankClass}`}>#{rank}</div>
          <div className="program-info">
            <div className="program-name">{program.name}</div>
            <div className="program-meta">
              <span className="meta-chip">
                <span className="chip-icon">📍</span>
                {program.location}
              </span>
              <span className="meta-chip">
                <span className="chip-icon">🛡️</span>
                {program.safety}
              </span>
              <span className="meta-chip">
                <span className="chip-icon">💰</span>
                {formatCost(program.cost)}
              </span>
              <span className="meta-chip">
                <span className="chip-icon">{program.format === 'online' ? '🖥️' : '🏫'}</span>
                {program.format === 'online' ? 'Online' : 'In-Person'}
              </span>
              <span className="meta-chip">
                <span className="chip-icon">⏱</span>
                {program.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Score & Save */}
        <div className="program-card-actions">
          <div className="match-score-ring">
            <div
              className={`score-circle ${scoreClass}`}
              style={{ '--score-pct': scorePct }}
            >
              <div className="score-circle-inner">
                {program.matchScore}%
              </div>
            </div>
            <div className="score-label">Match</div>
          </div>

          <button
            type="button"
            className={`save-star-button ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveClick}
            aria-label={isSaved ? `Remove ${program.name} from saved programs` : `Save ${program.name}`}
            title={isSaved ? 'Saved' : 'Save program'}
          >
            ★
          </button>
        </div>
      </div>

      {/* Why this fits */}
      <div className="why-fits">
        <div className="why-fits-label">✦ Why this fits you</div>
        <div className="why-fits-text">
          <ReactMarkdown>{shortReason}</ReactMarkdown>
        </div>

        {/* Breakdown bars */}
        <div className="breakdown-bars" style={{ marginTop: '12px' }}>
          {Object.entries(BREAKDOWN_LABELS).map(([key, label]) => {
            const score = program.breakdown?.[key] ?? 0;
            return (
              <div className="breakdown-bar-item" key={key}>
                <div className="breakdown-bar-label">{label}</div>
                <div className="breakdown-bar-track">
                  <div
                    className={`breakdown-bar-fill ${getBarClass(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <div className="breakdown-bar-pct">{score}%</div>
              </div>
            );
          })}
        </div>

        <div className="see-details">
          View full details & AI explanation →
        </div>
      </div>
    </div>
  );
}
