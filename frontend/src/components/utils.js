/**
 * Generates a short, varied "why this fits you" blurb for the card view.
 * Highlights the most notable match factor rather than always listing everything.
 */
export function getShortFitReason(profile, program) {
  const { breakdown, cost, format, duration } = program;
  const gpa = parseFloat(profile.gpa);
  const budget = parseFloat(profile.budget);

  const isFree = cost === 0;
  const strongInterest = breakdown.interestMatch >= 85;
  const goodGPA = breakdown.gpaEligibility === 100 && !isNaN(gpa) && gpa >= program.minGPA + 0.2;
  const formatMatch = breakdown.formatMatch === 100 && profile.format !== 'no preference';
  const withinBudget = !isNaN(budget) && cost > 0 && cost <= budget;

  const matched = getMatchedInterests(profile, program);
  const matchedStr = matched.slice(0, 2).join(' & ') || 'your academic interests';

  if (isFree && strongInterest) {
    return `This is a **free** program that directly aligns with your passion for **${matchedStr}** — a rare combination that's hard to pass up.`;
  }
  if (isFree) {
    return `At **no cost**, this program removes one of the biggest barriers to pre-college enrichment, and your profile meets its academic requirements.`;
  }
  if (strongInterest && goodGPA) {
    return `Your interest in **${matchedStr}** and strong **${gpa} GPA** are exactly what this program looks for — you're a natural academic fit.`;
  }
  if (strongInterest && formatMatch) {
    return `This **${format}** program lines up with your focus on **${matchedStr}**, matching both your subject interests and format preference.`;
  }
  if (strongInterest) {
    return `Your interest in **${matchedStr}** aligns closely with this program's curriculum — you'd be studying the topics you care about most.`;
  }
  if (withinBudget && goodGPA) {
    return `At **$${cost.toLocaleString()}**, this fits your budget, and your **${gpa} GPA** comfortably meets the requirements.`;
  }
  if (goodGPA) {
    return `With a **${gpa} GPA**, you're above this program's minimum threshold — giving you a competitive edge in the applicant pool.`;
  }
  return `This program offers strong learning opportunities aligned with your stated interests and preferences.`;
}

function getMatchedInterests(profile, program) {
  const interests = (profile.interests || []).map(i => i.toLowerCase());
  const areas = (program.subjectAreas || []).map(a => a.toLowerCase());
  return interests.filter(i => areas.some(a => a.includes(i) || i.includes(a)));
}


export function getScoreClass(score) {
  if (score >= 75) return 'score-high';
  if (score >= 50) return 'score-mid';
  return 'score-low';
}

export function formatCost(cost) {
  if (cost === 0) return 'Free';
  return `$${cost.toLocaleString()}`;
}

export function getBarClass(score) {
  if (score >= 75) return 'high';
  if (score >= 45) return 'mid';
  return 'low';
}
