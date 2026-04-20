import { useState } from 'react';

const INTERESTS = [
  'Computer Science', 'Mathematics', 'Biology', 'Chemistry',
  'Physics', 'Engineering', 'Humanities', 'Writing',
  'Economics', 'Social Sciences', 'Business', 'Arts',
  'Leadership', 'Data Science', 'Medicine', 'Political Science',
];

const DEFAULTS = {
  gpa: '',
  gradeLevel: '',
  budget: '',
  format: 'no preference',
  durationMin: '1',
  durationMax: '8',
  location: '',
};

export default function UserForm({ onSubmit, loading }) {
  const [interests, setInterests] = useState([]);
  const [fields, setFields] = useState(DEFAULTS);
  const [error, setError] = useState('');

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleChange = (e) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (interests.length === 0) {
      setError('Please select at least one area of interest.');
      return;
    }
    if (!fields.gpa || isNaN(parseFloat(fields.gpa))) {
      setError('Please enter your GPA.');
      return;
    }
    if (!fields.gradeLevel) {
      setError('Please select your grade level.');
      return;
    }

    const profile = {
      interests: interests.map((i) => i.toLowerCase()),
      ...fields,
      gpa: parseFloat(fields.gpa),
      budget: fields.budget ? parseFloat(fields.budget) : 99999,
    };

    onSubmit(profile);
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Tell us about yourself</h2>
        <p>Help our AI counselor find the programs that are truly right for you.</p>
      </div>

      {/* Interests */}
      <div className="form-group" style={{ marginBottom: '24px' }}>
        <label>Areas of Interest <span style={{ color: 'var(--accent-primary-light)' }}>*</span></label>
        <div className="interest-tags">
          {INTERESTS.map((interest) => (
            <button
              key={interest}
              type="button"
              className={`interest-tag ${interests.includes(interest) ? 'selected' : ''}`}
              onClick={() => toggleInterest(interest)}
            >
              {interests.includes(interest) ? '✓ ' : ''}{interest}
            </button>
          ))}
        </div>
      </div>

      <div className="form-grid">
        {/* GPA */}
        <div className="form-group">
          <label>GPA (0.0 – 4.0) <span style={{ color: 'var(--accent-primary-light)' }}>*</span></label>
          <input
            type="number"
            name="gpa"
            step="0.1"
            min="0"
            max="4"
            placeholder="e.g. 3.7"
            value={fields.gpa}
            onChange={handleChange}
          />
        </div>

        {/* Grade Level */}
        <div className="form-group">
          <label>Current Grade <span style={{ color: 'var(--accent-primary-light)' }}>*</span></label>
          <select name="gradeLevel" value={fields.gradeLevel} onChange={handleChange}>
            <option value="">Select grade…</option>
            <option value="9">9th Grade</option>
            <option value="10">10th Grade</option>
            <option value="11">11th Grade</option>
            <option value="12">12th Grade</option>
          </select>
        </div>

        {/* Budget */}
        <div className="form-group">
          <label>Maximum Budget ($)</label>
          <input
            type="number"
            name="budget"
            step="100"
            min="0"
            placeholder="Leave blank for any cost"
            value={fields.budget}
            onChange={handleChange}
          />
        </div>

        {/* Format */}
        <div className="form-group">
          <label>Program Format</label>
          <select name="format" value={fields.format} onChange={handleChange}>
            <option value="no preference">No Preference</option>
            <option value="in-person">In-Person Only</option>
            <option value="online">Online Only</option>
          </select>
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Preferred Location (Optional)</label>
          <input
            type="text"
            name="location"
            placeholder="e.g. California, East Coast…"
            value={fields.location}
            onChange={handleChange}
          />
        </div>

        {/* Duration */}
        <div className="form-group">
          <label>Duration Preference (Weeks)</label>
          <div className="duration-row">
            <input
              type="number"
              name="durationMin"
              min="0"
              max="20"
              value={fields.durationMin}
              onChange={handleChange}
              style={{ width: '80px', minWidth: 0 }}
            />
            <span>to</span>
            <input
              type="number"
              name="durationMax"
              min="0"
              max="20"
              value={fields.durationMax}
              onChange={handleChange}
              style={{ width: '80px', minWidth: 0 }}
            />
            <span>weeks</span>
          </div>
        </div>
      </div>

      {error && (
        <p style={{ color: '#f87171', fontSize: '0.88rem', marginBottom: '16px' }}>⚠ {error}</p>
      )}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? (
          <>
            <div className="loading-spinner" style={{ width: '18px', height: '18px', margin: 0 }} />
            Analyzing your profile…
          </>
        ) : (
          <>✦ Find My Best Programs</>
        )}
      </button>
    </form>
  );
}
