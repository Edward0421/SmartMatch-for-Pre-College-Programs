import ProgramCard from './ProgramCard';

export default function ProgramList({
  programs,
  profile,
  onProgramClick,
  savedPrograms,
  onToggleSave,
}) {
  if (!programs || programs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>No programs found</h3>
        <p>Try adjusting your grade level or broadening your interests.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="results-header">
        <div>
          <h2>Your Personalized Matches</h2>
          <p>Based on your academic profile, our AI counselor identified these programs.</p>
        </div>
        <div className="results-count-badge">{programs.length} programs found</div>
      </div>

      <div className="program-list">
        {programs.map((program, index) => (
          <ProgramCard
            key={program.id}
            program={program}
            rank={index + 1}
            profile={profile}
            isSaved={savedPrograms.includes(program.id)}
            onClick={() => onProgramClick(program)}
            onToggleSave={() => onToggleSave(program.id)}
          />
        ))}
      </div>
    </div>
  );
}
