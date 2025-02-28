import React, { useState } from "react";
import { Container, Typography, TextField, Button, Paper } from "@mui/material";

function ThemeSettings({ themeOptions, updateThemeOptions }) {
  // Local state to hold form values
  const [primary, setPrimary] = useState(themeOptions.primary);
  const [secondary, setSecondary] = useState(themeOptions.secondary);
  const [fontFamily, setFontFamily] = useState(themeOptions.fontFamily);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateThemeOptions({
      primary,
      secondary,
      fontFamily,
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: "12px" }}>
        <Typography variant="h5" gutterBottom>
          Customize Your Theme
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Primary Color"
            value={primary}
            onChange={(e) => setPrimary(e.target.value)}
            margin="normal"
            helperText="Enter a hex code, e.g., #1976d2"
          />
          <TextField
            fullWidth
            label="Secondary Color"
            value={secondary}
            onChange={(e) => setSecondary(e.target.value)}
            margin="normal"
            helperText="Enter a hex code, e.g., #dc004e"
          />
          <TextField
            fullWidth
            label="Font Family"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            margin="normal"
            helperText='Example: "Roboto, Helvetica, Arial, sans-serif"'
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Update Theme
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default ThemeSettings;
