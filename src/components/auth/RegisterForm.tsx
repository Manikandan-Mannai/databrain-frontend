import React, { useState } from "react";
import { Box, Button, TextField, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    navigate("/auth/login");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        bgcolor: "#fff",
        p: 3,
        borderRadius: 2,
        width: 320,
      }}
    >
      <Stack spacing={1.5}>
        <TextField
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          size="small"
          InputProps={{ sx: { height: 38, fontSize: 14, bgcolor: "#fff" } }}
        />
        <TextField
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          size="small"
          InputProps={{ sx: { height: 38, fontSize: 14, bgcolor: "#fff" } }}
        />
        <TextField
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          size="small"
          InputProps={{ sx: { height: 38, fontSize: 14, bgcolor: "#fff" } }}
        />
        <TextField
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          size="small"
          InputProps={{ sx: { height: 38, fontSize: 14, bgcolor: "#fff" } }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            textTransform: "none",
            bgcolor: "black",
            color: "white",
            height: 38,
            borderRadius: 1.5,
            fontSize: 14,
            "&:hover": { bgcolor: "#333" },
          }}
        >
          {loading ? "Creating..." : "Create Account"}
        </Button>

        <Button
          component={Link}
          to="/auth/login"
          sx={{
            textTransform: "none",
            color: "black",
            fontSize: 13,
            mt: 1,
          }}
        >
          Already have an account? Login
        </Button>
      </Stack>
    </Box>
  );
};

export default RegisterForm;
