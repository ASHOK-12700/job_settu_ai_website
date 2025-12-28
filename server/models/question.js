const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["intro", "hr", "behavioural", "technical"],
      default: "intro",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    tags: [String] // ex: ["freshers", "javascript"]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
