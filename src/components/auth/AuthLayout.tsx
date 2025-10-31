import React from "react";
import { Box, Paper, Typography } from "@mui/material";

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" mb={3} textAlign="center" fontWeight={600}>
          {title}
        </Typography>
        {children}
      </Paper>
    </Box>
  );
};

export default AuthLayout;
