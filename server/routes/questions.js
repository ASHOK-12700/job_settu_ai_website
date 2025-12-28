const express = require("express");
const Question = require("../models/Question");

const router = express.Router();

/**
 * POST /api/questions/seed
 * Body: array of questions to insert once
 */
router.post("/seed", async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "questions array required" });
    }

    const created = await Question.insertMany(questions);
    return res.status(201).json({
      message: "Questions seeded",
      count: created.length,
    });
  } catch (err) {
    console.error("Seed questions error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/questions/next
 * Optional query: ?category=intro
 */
router.get("/next", async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const count = await Question.countDocuments(filter);
    if (count === 0) {
      return res.status(404).json({ message: "No questions found" });
    }

    const randomIndex = Math.floor(Math.random() * count);

    const question = await Question.findOne(filter).skip(randomIndex);

    return res.json({
      id: question._id,
      text: question.text,
      category: question.category,
      difficulty: question.difficulty,
      tags: question.tags,
    });
  } catch (err) {
    console.error("Get next question error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
