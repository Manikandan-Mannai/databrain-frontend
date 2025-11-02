import React, { useState } from "react";
import { Box, Button, TextField, Stack, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store/store";
import { register } from "../../redux/slices/authSlice";

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;

    const res = await dispatch(
      register({
        name: form.name,
        email: form.email,
        password: form.password,
      })
    );

    if (register.fulfilled.match(res)) navigate("/auth/login");
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

        {error && (
          <Typography color="error" fontSize={13}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={status === "loading"}
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
          {status === "loading" ? "Creating..." : "Create Account"}
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
