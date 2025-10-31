// src/components/auth/RegisterForm.tsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      console.log("Register form submitted:", form);
      await new Promise((r) => setTimeout(r, 1500));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Full Name"
        name="name"
        fullWidth
        margin="normal"
        value={form.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Email"
        name="email"
        fullWidth
        margin="normal"
        value={form.email}
        onChange={handleChange}
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        fullWidth
        margin="normal"
        value={form.password}
        onChange={handleChange}
        required
      />
      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        fullWidth
        margin="normal"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />

      {error && (
        <Typography color="error" fontSize={14} mt={1}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? "Creating account..." : "Register"}
      </Button>

      <Box mt={2} textAlign="center">
        <Typography
          component={Link}
          to="/auth/login"
          color="primary"
          sx={{ textDecoration: "none", fontSize: 14 }}
        >
          Already have an account? Login
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterForm;
