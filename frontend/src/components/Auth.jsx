import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";

function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);

  const handleTabChange = (event, newValue) => {
    setIsLogin(newValue === 0);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "violet",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: "15px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Tabs
          value={isLogin ? 0 : 1}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab
            label="Login"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
          <Tab
            label="Register"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
        </Tabs>
        {isLogin ? <Login setUser={setUser} /> : <Register />}
      </Paper>
    </Container>
  );
}

export default Auth;
