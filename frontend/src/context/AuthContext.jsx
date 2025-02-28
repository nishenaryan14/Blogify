import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create a Context for auth
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Rehydrate user from sessionStorage on initialization
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Login function
  const login = async (credentials) => {
    // credentials: { username, password }
    await axios.post("/auth/login", credentials, {
      withCredentials: true,
    });
    // Since backend doesn't return user data, we assume success and store username
    const userData = { username: credentials.username };
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout function
  const logout = async () => {
    await axios.get("/auth/logout", { withCredentials: true });
    setUser(null);
    sessionStorage.removeItem("user");
  };

  // On mount, attempt to fetch active session from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/me", { withCredentials: true });
        if (response.data.user) {
          setUser(response.data.user);
          sessionStorage.setItem("user", JSON.stringify(response.data.user));
        }
      } catch (error) {
        console.error("No active session found", error);
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth
export const useAuth = () => useContext(AuthContext);
