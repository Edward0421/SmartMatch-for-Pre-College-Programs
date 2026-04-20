/**
 * Vantion SmartMatch — AI Explanation Service (Gemini Edition)
 * Uses Google Gemini to generate personalized, counselor-style explanations.
 * Falls back to a template-based explanation if the API call fails or key is missing.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

function getGeminiClient() {
  if (!genAI && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Generate a personalized explanation using Gemini.
 */
async function generateExplanation(profile, program) {
  const client = getGeminiClient();

  if (client) {
    try {
      return await generateWithGemini(client, profile, program);
    } catch (err) {
      console.warn('[Gemini] API error, falling back to template:', err.message);
    }
  }

  // Fallback: template-based explanation
  return generateTemplate(profile, program);
}

/**
 * Gemini-powered explanation
 */
async function generateWithGemini(client, profile, program) {
  const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const interests = (profile.interests || []).join(', ') || 'various subjects';
  const matchedAreas = getMatchedAreas(profile, program);
  const costStr = program.cost === 0 ? 'completely free' : `$${program.cost.toLocaleString()}`;

  const prompt = `You are a warm, supportive AI college counselor helping a high school student find the right pre-college program. Write a personalized explanation (3–5 sentences) of why the following program is a good fit for this student.

Student Profile:
- Interests: ${interests}
- GPA: ${profile.gpa}
- Grade: ${profile.gradeLevel}th grade
- Budget: ${profile.budget ? '$' + Number(profile.budget).toLocaleString() : 'flexible'}
- Format preference: ${profile.format || 'no preference'}

Program: ${program.name}
- Subject areas: ${program.subjectAreas.join(', ')}
- Location: ${program.location}
- Format: ${program.format}
- Cost: ${costStr}
- Duration: ${program.duration}
- Match score: ${program.matchScore}%
- Matched interest areas: ${matchedAreas.join(', ') || 'general academics'}

Instructions:
- Start with "Based on your profile, " 
- Use a warm, encouraging counselor tone — not salesy
- Mention specific interests or academic strengths that align
- If the program is free, highlight that
- If the GPA meets the requirement, mention that as a strength
- Keep it concise and personal — no bullet points, just flowing paragraphs
- End with a brief encouragement to explore or apply`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Template fallback — used when no API key is configured
 */
function generateTemplate(profile, program) {
  const { breakdown, matchScore } = program;
  const lines = [];

  if (matchScore >= 85) {
    lines.push(`Based on your profile, **${program.name}** looks like an excellent match. Here's why this program stands out for you:`);
  } else if (matchScore >= 65) {
    lines.push(`Based on your profile, **${program.name}** is a strong contender. Here's what makes it a good fit:`);
  } else {
    lines.push(`Based on your profile, **${program.name}** could be worth considering. Here are the areas where it aligns with your goals:`);
  }

  if (breakdown.interestMatch >= 80) {
    const matched = getMatchedAreas(profile, program);
    if (matched.length > 0) {
      lines.push(`🎯 **Strong Interest Alignment**: Your interest in ${formatList(matched)} maps directly to this program's curriculum. You'll be studying exactly what excites you.`);
    }
  } else if (breakdown.interestMatch >= 50) {
    lines.push(`📚 **Partial Interest Overlap**: Some of this program's subjects align with your interests, and there's room to discover new areas you might love.`);
  }

  const gpa = parseFloat(profile.gpa);
  if (breakdown.gpaEligibility === 100 && !isNaN(gpa)) {
    if (gpa >= program.minGPA + 0.3) {
      lines.push(`⭐ **Academically Competitive**: With a ${gpa} GPA, you're above this program's minimum of ${program.minGPA}, putting you in a strong position.`);
    } else {
      lines.push(`✅ **GPA Meets Requirements**: Your ${gpa} GPA meets this program's academic standards.`);
    }
  }

  if (program.cost === 0) {
    lines.push(`💰 **Completely Free**: This program costs nothing to attend — a rare opportunity with zero financial barrier.`);
  } else if (!isNaN(parseFloat(profile.budget)) && program.cost <= parseFloat(profile.budget)) {
    lines.push(`💳 **Within Your Budget**: At $${program.cost.toLocaleString()}, this program fits your stated budget.`);
  }

  if (breakdown.formatMatch === 100) {
    lines.push(`🖥️ **Format Match**: This is ${program.format === 'online' ? 'an online' : 'an in-person'} program, matching your preference.`);
  }

  if (matchScore >= 80) {
    lines.push(`\n> **Our Recommendation**: This is one of your top matches — we encourage you to explore it further and consider applying.`);
  } else {
    lines.push(`\n> **Our Take**: This is a solid option worth reviewing in more detail.`);
  }

  return lines.join('\n\n');
}

function getMatchedAreas(profile, program) {
  const interests = (profile.interests || []).map(i => i.toLowerCase().trim());
  const areas = program.subjectAreas.map(a => a.toLowerCase());
  const matched = [];
  for (const interest of interests) {
    for (const area of areas) {
      if (area.includes(interest) || interest.includes(area)) {
        matched.push(interest);
        break;
      }
    }
  }
  return [...new Set(matched)];
}

function formatList(items) {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

module.exports = { generateExplanation };
