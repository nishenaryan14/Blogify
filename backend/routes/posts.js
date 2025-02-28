// routes/posts.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// Simple middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}

// Create a new post (requires authentication)
router.post("/", ensureAuthenticated, postController.createPost);

// Get all posts
router.get("/", postController.getAllPosts);

// Get a single post by ID
router.get("/:id", postController.getPostById);

// Update a post (requires authentication)
router.put("/:id", ensureAuthenticated, postController.updatePost);

// Delete a post (requires authentication)
router.delete("/:id", ensureAuthenticated, postController.deletePost);

module.exports = router;
