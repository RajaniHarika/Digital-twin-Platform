import { Box, Typography, Button, Container } from '@mui/material';
import { ErrorOutline, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            mb: 4,
            position: 'relative',
          }}
        >
          <ErrorOutline
            sx={{
              fontSize: 120,
              color: 'text.disabled',
            }}
          />
        </Box>

        <Typography variant="h2" fontWeight={700} gutterBottom>
          404
        </Typography>

        <Typography variant="h5" gutterBottom color="text.primary">
          Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
          The page you are looking for doesn't exist or has been moved to a different location.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            size="large"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            size="large"
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;