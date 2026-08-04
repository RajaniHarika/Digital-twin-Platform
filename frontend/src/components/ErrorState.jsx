import { Box, Typography, Button, Alert, AlertTitle } from '@mui/material';
import { Refresh, Home } from '@mui/icons-material';

const ErrorState = ({ message, onRetry, showHome = true }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 400,
      p: 3,
    }}
  >
    <Alert severity="error" sx={{ maxWidth: 500, mb: 3 }}>
      <AlertTitle>Error</AlertTitle>
      {message || 'Something went wrong. Please try again later.'}
    </Alert>
    <Box sx={{ display: 'flex', gap: 2 }}>
      {onRetry && (
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={onRetry}
        >
          Retry
        </Button>
      )}
      {showHome && (
        <Button
          variant="outlined"
          startIcon={<Home />}
          href="/"
        >
          Go Home
        </Button>
      )}
    </Box>
  </Box>
);

export default ErrorState;