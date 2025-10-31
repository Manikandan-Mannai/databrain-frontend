import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h3" gutterBottom>
        Unauthorized Access
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You don’t have permission to view this page.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Go Back Home
      </Button>
    </Box>
  );
};

export default Unauthorized;
