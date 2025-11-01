// src/theme/getMuiTheme.ts
import { createTheme } from "@mui/material";

export const getMuiTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#0075FF" : "#1db3c7",
        contrastText: "#fff",
      },
      secondary: {
        main: mode === "light" ? "#6c757d" : "#90A4AE",
      },
      background: {
        default: mode === "light" ? "#f8f9fa" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1a1a1a",
      },
      text: {
        primary: mode === "light" ? "#212529" : "#e0e0e0",
        secondary: mode === "light" ? "#6c757d" : "#b0b0b0",
      },
    },
    typography: {
      fontFamily: "sans-serif",
    },
    shape: {
      borderRadius: 12,
    },
  });
