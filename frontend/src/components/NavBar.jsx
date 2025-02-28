import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useAuth } from "../context/AuthContext";

function NavBar({ toggleTheme, theme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: theme === "light" ? "#f5f5f5" : "#333",
        color: theme === "light" ? "#333" : "#f5f5f5",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Home
          </Button>
          {user && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/create"
                sx={{ textTransform: "none", fontWeight: "bold" }}
              >
                Create Post
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/settings"
                sx={{ textTransform: "none", fontWeight: "bold" }}
              >
                Theme Settings
              </Button>
            </>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" onClick={toggleTheme}>
            {theme === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          {user && (
            <>
              <Typography variant="body1" sx={{ ml: 2, fontWeight: "bold" }}>
                Hello, {user.username}
              </Typography>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ ml: 2, textTransform: "none", fontWeight: "bold" }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
