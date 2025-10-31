// src/components/auth/ForgotPasswordForm.tsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Forgot password email:", email);
      await new Promise((r) => setTimeout(r, 1500)); // simulate API
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Box textAlign="center">
        <Typography variant="body1" mb={2}>
          If this email is registered, a reset link has been sent.
        </Typography>
        <Typography
          component={Link}
          to="/auth/login"
          color="primary"
          sx={{ textDecoration: "none" }}
        >
          Back to Login
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>
      <Box mt={2} textAlign="center">
        <Typography
          component={Link}
          to="/auth/login"
          color="primary"
          sx={{ textDecoration: "none", fontSize: 14 }}
        >
          Back to Login
        </Typography>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;
