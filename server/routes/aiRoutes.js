// routes/aiRoutes.js
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const chatOpenai = new OpenAI({
  apiKey: process.env.CHATBOT_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

router.post("/gemini-placement-chat", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are an AI placement assistant helping Indian CS students with interview prep, programming and careers.",
      },
      ...conversationHistory.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const completion = await chatOpenai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      temperature: 0.7,
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    return res.json({
      message: reply,
      conversationState: { api: "openai" },
    });
  } catch (err) {
    console.error("gemini-placement-chat error:", err.response?.data || err);
    return res.status(500).json({
      message: "Server error while talking to AI.",
      details: err.message,
    });
  }
});

export default router;
