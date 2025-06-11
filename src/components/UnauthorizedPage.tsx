import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LockOutlined, Home } from "@mui/icons-material";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          gap: 3
        }}
      >
        <LockOutlined sx={{ fontSize: 80, color: 'text.secondary' }} />
        
        <Typography variant="h3" component="h1" gutterBottom>
          403
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom>
          Unauthorized Access
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You don't have permission to access this page. 
          Admin privileges are required to view the dashboard and charts.
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate('/')}
          size="large"
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage; 