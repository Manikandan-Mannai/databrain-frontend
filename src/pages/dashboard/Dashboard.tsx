import { Box, Paper, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>Welcome to your admin dashboard.</Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;
