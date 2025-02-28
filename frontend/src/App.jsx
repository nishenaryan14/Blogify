import React, { useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import Auth from "./components/Auth"; // Combined login/register component
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import ThemeSettings from "./components/ThemeSettings";
import "./App.css";

// Optionally set Axios to always include credentials.
axios.defaults.withCredentials = true;

// ProtectedRoute component to guard private routes
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" />;
  }
  return children;
};

function AppContent() {
  // Initialize themeOptions from localStorage if available; otherwise, use defaults.
  const [themeOptions, setThemeOptions] = useState(() => {
    const stored = localStorage.getItem("themeOptions");
    return stored
      ? JSON.parse(stored)
      : {
          mode: "light",
          primary: "#1976d2",
          secondary: "#dc004e",
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        };
  });

  // Update localStorage whenever themeOptions change.
  useEffect(() => {
    localStorage.setItem("themeOptions", JSON.stringify(themeOptions));
  }, [themeOptions]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeOptions.mode,
          primary: { main: themeOptions.primary },
          secondary: { main: themeOptions.secondary },
        },
        typography: { fontFamily: themeOptions.fontFamily },
      }),
    [themeOptions]
  );

  const toggleThemeMode = () => {
    setThemeOptions((prev) => ({
      ...prev,
      mode: prev.mode === "light" ? "dark" : "light",
    }));
  };

  const updateThemeOptions = (newOptions) => {
    setThemeOptions((prev) => ({ ...prev, ...newOptions }));
  };

  // Get user from context
  const { user } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Render NavBar only if user is logged in */}
        {user && (
          <NavBar toggleTheme={toggleThemeMode} theme={themeOptions.mode} />
        )}
        <Routes>
          {/* Auth routes */}
          <Route path="/auth" element={<Auth />} />
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <PostList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <PostForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ThemeSettings
                  themeOptions={themeOptions}
                  updateThemeOptions={updateThemeOptions}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
