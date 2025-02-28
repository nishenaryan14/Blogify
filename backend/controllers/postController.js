// controllers/postController.js
const Post = require("../models/Post");
const marked = require("marked");

exports.createPost = async (req, res) => {
  console.log("req.user:", req.user); // Debug log
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  const { title, content } = req.body;
  try {
    // If you're using Marked v4 or later, use marked.parse() instead of marked()
    const htmlContent = marked.parse(content);
    const newPost = new Post({
      title,
      content,
      htmlContent,
      author: req.user._id,
    });
    await newPost.save();
    res.json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    console.error("Error in createPost:", err);
    res
      .status(500)
      .json({ message: "Error creating post", error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", error: err });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post", error: err });
  }
};

exports.updatePost = async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only edit your own posts" });
    }
    post.title = title || post.title;
    post.content = content || post.content;
    // Use marked.parse() if you are using Marked v4 or later
    post.htmlContent = marked.parse(post.content);
    await post.save();
    res.json({ message: "Post updated successfully", post });
  } catch (err) {
    console.error("Error updating post:", err);
    res
      .status(500)
      .json({ message: "Error updating post", error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only delete your own posts" });
    }
    // Use deleteOne() instead of remove()
    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res
      .status(500)
      .json({ message: "Error deleting post", error: err.message });
  }
};
