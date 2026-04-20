/**
 * Vantion SmartMatch — Scoring Engine
 * Rule-based scoring system that evaluates how well each program fits a student profile.
 */

const WEIGHTS = {
  interestMatch: 35,
  gpaEligibility: 20,
  budgetFit: 20,
  formatMatch: 15,
  durationFit: 10,
};

/**
 * Compute interest match score (0–100)
 * Checks how many of the student's interests align with the program's subject areas.
 */
function scoreInterestMatch(profile, program) {
  if (!profile.interests || profile.interests.length === 0) return 50;

  const studentInterests = profile.interests.map((i) =>
    i.toLowerCase().trim()
  );
  const programAreas = program.subjectAreas.map((a) => a.toLowerCase());

  let matches = 0;
  for (const interest of studentInterests) {
    for (const area of programAreas) {
      if (area.includes(interest) || interest.includes(area)) {
        matches++;
        break;
      }
    }
  }

  return Math.min(100, Math.round((matches / studentInterests.length) * 100));
}

/**
 * Compute GPA eligibility score (0 or 100)
 * If the student meets the minimum GPA, full points. Partial credit for near misses.
 */
function scoreGPAEligibility(profile, program) {
  const gpa = parseFloat(profile.gpa);
  const minGPA = program.minGPA;

  if (isNaN(gpa) || !minGPA) return 75;
  if (gpa >= minGPA) return 100;
  const diff = minGPA - gpa;
  if (diff <= 0.2) return 60;
  if (diff <= 0.5) return 30;
  return 0;
}

/**
 * Compute budget fit score (0–100)
 * Free programs always score 100. Scaled by how much over budget.
 */
function scoreBudgetFit(profile, program) {
  const budget = parseFloat(profile.budget);
  const cost = program.cost;

  if (isNaN(budget)) return 75;
  if (cost === 0) return 100;
  if (cost <= budget) return 100;

  const overageRatio = (cost - budget) / budget;
  if (overageRatio <= 0.1) return 80;
  if (overageRatio <= 0.25) return 55;
  if (overageRatio <= 0.5) return 30;
  return 10;
}

/**
 * Compute format match score (0 or 100)
 * Exact format match = 100, no preference = 75, mismatch = 30.
 */
function scoreFormatMatch(profile, program) {
  if (!profile.format || profile.format === "no preference") return 75;
  return profile.format.toLowerCase() === program.format.toLowerCase()
    ? 100
    : 20;
}

/**
 * Compute duration fit score (0–100)
 * Compares preferred duration range (weeks) with program duration.
 */
function scoreDurationFit(profile, program) {
  const prefMin = parseFloat(profile.durationMin) || 0;
  const prefMax = parseFloat(profile.durationMax) || 99;
  const programWeeks = program.durationWeeks;

  if (programWeeks >= prefMin && programWeeks <= prefMax) return 100;

  const diff = Math.min(
    Math.abs(programWeeks - prefMin),
    Math.abs(programWeeks - prefMax)
  );
  if (diff <= 1) return 75;
  if (diff <= 2) return 50;
  if (diff <= 4) return 25;
  return 10;
}

/**
 * Check grade eligibility (hard filter)
 */
function isGradeEligible(profile, program) {
  const grade = parseInt(profile.gradeLevel);
  if (isNaN(grade)) return true;
  return program.gradeEligibility.includes(grade);
}

/**
 * Main scoring function
 * Returns an array of programs with scores, sorted by matchScore descending.
 */
function scorePrograms(profile, programs) {
  const results = programs
    .filter((program) => isGradeEligible(profile, program))
    .map((program) => {
      const interestScore = scoreInterestMatch(profile, program);
      const gpaScore = scoreGPAEligibility(profile, program);
      const budgetScore = scoreBudgetFit(profile, program);
      const formatScore = scoreFormatMatch(profile, program);
      const durationScore = scoreDurationFit(profile, program);

      const matchScore = Math.round(
        (interestScore * WEIGHTS.interestMatch +
          gpaScore * WEIGHTS.gpaEligibility +
          budgetScore * WEIGHTS.budgetFit +
          formatScore * WEIGHTS.formatMatch +
          durationScore * WEIGHTS.durationFit) /
          100
      );

      const breakdown = {
        interestMatch: interestScore,
        gpaEligibility: gpaScore,
        budgetFit: budgetScore,
        formatMatch: formatScore,
        durationFit: durationScore,
      };

      return { ...program, matchScore, breakdown };
    });

  results.sort((a, b) => b.matchScore - a.matchScore);
  return results.slice(0, 5);
}

module.exports = { scorePrograms };
