const express = require("express");
const router = express.Router();
const programs = require("../data/programs.json");
const { scorePrograms } = require("../utils/scoring");
const { generateExplanation } = require("../services/explanationService");

// GET /api/programs — return all mock programs
router.get("/programs", (req, res) => {
  res.json({ success: true, data: programs });
});

// POST /api/match-programs — score and rank programs for a student profile
router.post("/match-programs", (req, res) => {
  const profile = req.body;

  if (!profile || typeof profile !== "object") {
    return res.status(400).json({ success: false, error: "Invalid profile." });
  }

  const ranked = scorePrograms(profile, programs);

  res.json({ success: true, data: ranked });
});

// POST /api/explain-match — generate AI explanation for a specific match
router.post("/explain-match", async (req, res) => {
  const { profile, program } = req.body;

  if (!profile || !program) {
    return res
      .status(400)
      .json({ success: false, error: "Profile and program are required." });
  }

  try {
    const explanation = await generateExplanation(profile, program);
    res.json({ success: true, explanation });
  } catch (error) {
    console.error("Explanation generation failed:", error);
    res.status(500).json({ success: false, error: "Failed to generate explanation" });
  }
});

module.exports = router;
