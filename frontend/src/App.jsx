import { useEffect, useState } from 'react';
import UserForm from './components/UserForm';
import ProgramList from './components/ProgramList';
import ProgramDetail from './components/ProgramDetail';

const SAVED_PROGRAMS_KEY = 'smartmatch-saved-programs';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const [savedPrograms, setSavedPrograms] = useState([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SAVED_PROGRAMS_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setSavedPrograms(parsed);
      }
    } catch (err) {
      console.warn('Unable to load saved programs:', err);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SAVED_PROGRAMS_KEY, JSON.stringify(savedPrograms));
  }, [savedPrograms]);

  const toggleSavedProgram = (programId) => {
    setSavedPrograms((current) =>
      current.includes(programId)
        ? current.filter((id) => id !== programId)
        : [...current, programId]
    );
  };

  const handleFormSubmit = async (submittedProfile) => {
    setLoading(true);
    setError('');
    setHasSearched(false);
    setProfile(submittedProfile);

    try {
      const res = await fetch('/api/match-programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submittedProfile),
      });
      const data = await res.json();
      if (data.success) {
        setPrograms(data.data);
        setHasSearched(true);
        // Scroll to results
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect to the server. Please make sure the backend is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Nav */}
      <nav className="nav">
        <div className="nav-brand">
          <div className="nav-logo">V</div>
          <div>
            <div className="nav-title">Vantion SmartMatch</div>
            <div className="nav-subtitle">AI College Counseling</div>
          </div>
        </div>
        <div className="nav-actions">
          <button className="btn-ghost">🛒 Cart</button>
          <button className="btn-ghost">Log In</button>
          <button className="btn-ghost">Sign Up</button>
        </div>
      </nav>

      {/* Main */}
      <main className="main-content">
        {/* Hero */}
        <section className="hero">
          <div className="hero-eyebrow">✦ AI-Powered Program Discovery</div>
          <h1>
            Find the program that's
            <br />
            <span className="gradient-text">truly right for you</span>
          </h1>
          <p className="hero-desc">
            Our AI counselor analyzes your academic profile, interests, and preferences
            to match you with pre-college programs where you'll genuinely thrive.
          </p>
        </section>

        {/* Form */}
        <UserForm onSubmit={handleFormSubmit} loading={loading} />

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(248, 113, 113, 0.1)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            borderRadius: '12px',
            padding: '16px 20px',
            color: '#f87171',
            fontSize: '0.9rem',
            marginBottom: '28px',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Our AI counselor is reviewing your profile and matching programs…</p>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && (
          <section id="results">
            <ProgramList
              programs={programs}
              profile={profile}
              onProgramClick={setSelectedProgram}
              savedPrograms={savedPrograms}
              onToggleSave={toggleSavedProgram}
            />
          </section>
        )}

        {/* Empty results */}
        {!loading && hasSearched && programs.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <h3>No matching programs found</h3>
            <p>Try adjusting your grade level or expanding your budget and interests.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        Vantion SmartMatch · AI-powered pre-college program discovery · Built for students
      </footer>

      {/* Detail Modal */}
      {selectedProgram && (
        <ProgramDetail
          program={selectedProgram}
          profile={profile}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </div>
  );
}
