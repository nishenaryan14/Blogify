// models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String, // Markdown content
  htmlContent: String, // Converted HTML content
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
