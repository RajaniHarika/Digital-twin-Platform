import { Box, Typography, Button, Container } from '@mui/material';
import { ErrorOutline, Home, Dashboard } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';

const NotFound = () => {
  const navigate = useNavigate();
  const isAuthed = authService.isAuthenticated();

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <ErrorOutline sx={{ fontSize: 120, color: 'text.disabled', mb: 4 }} />
        <Typography variant="h2" fontWeight={700} gutterBottom>404</Typography>
        <Typography variant="h5" gutterBottom color="text.primary">Page Not Found</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {isAuthed ? (
            <Button variant="contained" startIcon={<Dashboard />} onClick={() => navigate('/dashboard')} size="large">
              Go to Dashboard
            </Button>
          ) : (
            <Button variant="contained" startIcon={<Home />} onClick={() => navigate('/')} size="large">
              Go to Home
            </Button>
          )}
          <Button variant="outlined" onClick={() => navigate(-1)} size="large">Go Back</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
