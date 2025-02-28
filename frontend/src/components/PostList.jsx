// src/components/PostList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

function PostList() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const loadPosts = async () => {
    try {
      const response = await axios.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // --- Edit Handlers ---
  const handleEditClick = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `/posts/${editingPost._id}`,
        { title: editTitle, content: editContent },
        { withCredentials: true }
      );
      toast.success(
        `Post edited successfully at ${new Date().toLocaleTimeString()}`
      );
      setEditingPost(null);
      loadPosts();
    } catch (error) {
      console.error("Error updating post", error);
      toast.error("Failed to update post");
    }
  };

  const handleEditDiscard = () => {
    setEditingPost(null);
  };

  // --- Delete Handlers ---
  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/posts/${postToDelete._id}`, {
        withCredentials: true,
      });
      toast.success(
        `Post deleted successfully at ${new Date().toLocaleTimeString()}`
      );
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      loadPosts();
    } catch (error) {
      console.error("Error deleting post", error);
      toast.error("Failed to delete post");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        gutterBottom
        sx={{ marginTop: 3, fontWeight: "bold" }}
      >
        All Posts
      </Typography>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card
            key={post._id}
            sx={{
              marginBottom: 3,
              borderRadius: "15px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {post.author.username.charAt(0).toUpperCase()}
                </Avatar>
              }
              title={post.title}
              subheader={`by ${post.author.username} on ${new Date(
                post.createdAt
              ).toLocaleString()}`}
              action={
                // Only show edit and delete options if current user is the owner.
                user &&
                user.username === post.author.username && (
                  <Box>
                    <IconButton
                      onClick={() => handleEditClick(post)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(post)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )
              }
              sx={{
                "& .MuiCardHeader-content": {
                  overflow: "hidden",
                },
              }}
            />
            <CardContent>
              <Box
                dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                sx={{
                  "& p": { marginBottom: 2 },
                  "& h1, & h2, & h3, & h4, & h5, & h6": {
                    marginTop: 2,
                    marginBottom: 1,
                  },
                }}
              />
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          No posts available.
        </Typography>
      )}

      {/* Edit Post Dialog */}
      <Dialog
        open={Boolean(editingPost)}
        onClose={handleEditDiscard}
        fullWidth
        maxWidth="sm"
        sx={{ zIndex: 1500 }}
      >
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Post Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Content"
            multiline
            rows={6}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDiscard} color="secondary">
            Discard
          </Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Container>
  );
}

export default PostList;
