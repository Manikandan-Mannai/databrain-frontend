import { Box, Card, CardContent, Typography } from "@mui/material";

const AuthLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#fff"
    >
      <Card
        sx={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            textAlign="center"
            color="black"
            mb={2}
          >
            {title}
          </Typography>
          {children}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthLayout;
