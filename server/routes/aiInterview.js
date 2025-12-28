const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ==================== NEXT QUESTION ==================== */

router.post("/next-question", async (req, res) => {
  const { domain, lastQuestion, lastAnswer } = req.body;
  const safeDomain = domain || "software engineering";

  const systemPrompt = `
You are an AI interview bot.
- Role/domain: ${safeDomain}
- Ask ONE question at a time.
- Difficulty: medium to slightly advanced, suitable for final-year engineering students.
- Mix: some conceptual, some scenario-based, some real-world examples.
- Use simple English.
- Do NOT include explanations, only the question text.
`;

  const userContext = `
Previous question: ${lastQuestion || "none"}
Candidate answer: ${lastAnswer || "none"}
Based on this, ask the next interview question.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContext },
      ],
      max_tokens: 120,
      temperature: 0.7,
    });

    const nextQuestion =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Tell me about yourself.";

    res.json({ questionText: nextQuestion });
  } catch (err) {
    console.error("AI question error:", err);
    res
      .status(500)
      .json({ message: "AI service error. Please try again in a moment." });
  }
});

/* ==================== FEEDBACK ROUTE ==================== */

router.post("/feedback", async (req, res) => {
  const { domain, answers } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    return res
      .status(400)
      .json({ message: "No answers provided for feedback." });
  }

  const safeDomain = domain || "software engineering";

  const qaText = answers
    .map(
      (item, idx) =>
        `Q${idx + 1}: ${item.question || "N/A"}\nA${idx + 1}: ${item.answer || "N/A"
        }`
    )
    .join("\n\n");

  const systemPrompt = `
You are an interview coach.
You only reply with JSON.
Your job is to evaluate a student's mock interview performance in ${safeDomain}.
Use very simple English and be encouraging.

The "summary" must be long: around 10 to 13 sentences.
In the summary, clearly talk about:
- overall communication
- technical correctness
- clarity and structure of answers
- use of examples or projects
- confidence level
- body language tips (general)
- time management in answers
- understanding of core concepts
- what they should study or practice next
- final motivation and encouragement.

Return ONLY valid JSON, no extra text.
JSON shape:
{
  "score": number,
  "summary": string,
  "strengths": string[],
  "improvements": string[]
}
`;

  const userPrompt = `
Here are the candidate's answers:

${qaText}

Please evaluate this interview and fill the JSON fields.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 400,
      temperature: 0.5,
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("Feedback JSON parse error:", e, raw);
      return res.status(500).json({
        message: "AI feedback could not be parsed. Please try again.",
      });
    }

    const feedback = {
      score:
        typeof parsed.score === "number"
          ? Math.round(parsed.score)
          : 5,
      summary:
        parsed.summary ||
        "Good attempt. Keep practicing your answers and focus on clarity, structure, and confidence.",
      strengths: Array.isArray(parsed.strengths)
        ? parsed.strengths
        : ["You tried to answer all questions."],
      improvements: Array.isArray(parsed.improvements)
        ? parsed.improvements
        : [
          "Give more structured answers.",
          "Add examples from your projects.",
          "Speak with more confidence.",
        ],
    };

    res.json(feedback);
  } catch (err) {
    console.error("AI feedback error:", err);
    res
      .status(500)
      .json({ message: "AI feedback service error. Please try again." });
  }
});

/* =========== GENERAL AI ASSISTANT (HYBRID: OpenAI + Gemini) =========== */

router.post("/gemini-placement-chat", async (req, res) => {
  const { message, conversationHistory } = req.body;

  try {
    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are a helpful, intelligent AI assistant that can answer any question on any topic. Be friendly, informative, and provide detailed, accurate responses. If asked about programming, career, or technical topics, provide structured guidance for Indian engineering students.",
      },
    ];

    if (conversationHistory && Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory.slice(-10);

      recentHistory.forEach((msg) => {
        if (
          msg.role === "assistant" &&
          (msg.content.includes("👋 Hello!") ||
            msg.content.includes("I'm your intelligent AI assistant"))
        ) {
          return;
        }

        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        });
      });
    }

    messages.push({
      role: "user",
      content: message,
    });

    console.log("Processing message with hybrid AI system...");

    let useOpenAI = true; // currently always OpenAI

    let aiMessage;

    if (useOpenAI) {
      console.log("Using OpenAI API...");
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 1000,
        temperature: 0.9,
        top_p: 0.9,
        presence_penalty: 0.6,
        frequency_penalty: 0.6,
      });

      aiMessage = completion.choices?.[0]?.message?.content;
    } else {
      console.log("Using Gemini API...");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const geminiMessages = messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
        history: geminiMessages.slice(0, -1),
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1000,
          topP: 0.9,
          topK: 40,
        },
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      aiMessage = response.text();
    }

    if (!aiMessage) {
      throw new Error("No response from AI service");
    }

    console.log("AI Response generated successfully");

    res.json({
      message: aiMessage.trim(),
      conversationState: {
        step: "general",
        api: useOpenAI ? "openai" : "gemini",
      },
    });
  } catch (err) {
    console.error("AI chat error FULL LOG:", err);

    let errorMessage =
      "Sorry, I'm having trouble connecting right now. Please try again in a moment.";

    // Provide more specific feedback if possible
    if (err.message && err.message.includes("401")) {
      errorMessage = "Authentication error with AI provider. Please check server logs.";
    } else if (err.message.includes("rate limit")) {
      errorMessage =
        "I'm receiving too many requests right now. Please wait a moment and try again.";
    } else if (err.message.includes("quota")) {
      errorMessage =
        "I've reached my usage limit. Please try again later.";
    } else if (
      err.message.includes("network") ||
      err.message.includes("timeout")
    ) {
      errorMessage =
        "Network connection issue. Please check your internet and try again.";
    }

    res.status(500).json({
      message: errorMessage,
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : undefined,
    });
  }
});

module.exports = router;
