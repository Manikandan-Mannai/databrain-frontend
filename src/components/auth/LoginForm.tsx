import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../redux/slices/authSlice";
import type { AppDispatch, RootState } from "../../redux/store/store";

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await dispatch(login(formData)).unwrap();
      toast.success(`Welcome back, ${result?.user?.name ?? "User"}`);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err ?? "Login failed");
    }
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
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          size="small"
          variant="outlined"
          fullWidth
          InputProps={{
            sx: { height: 38, fontSize: 14, bgcolor: "#fff" },
          }}
        />
        <TextField
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          size="small"
          variant="outlined"
          fullWidth
          InputProps={{
            sx: { height: 38, fontSize: 14, bgcolor: "#fff" },
          }}
        />
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
          {status === "loading" ? "Logging in..." : "Login"}
        </Button>

        <Button
          component={Link}
          to="/auth/register"
          sx={{
            textTransform: "none",
            color: "black",
            fontSize: 13,
            mt: 1,
          }}
        >
          Create an account
        </Button>
      </Stack>
    </Box>
  );
};

export default LoginForm;
