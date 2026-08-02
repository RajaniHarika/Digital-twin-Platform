import { Box, Typography, Button, alpha } from '@mui/material';
import { FolderOpen, Add } from '@mui/icons-material';

const EmptyState = ({
  title = 'No Data Found',
  description,
  action,
  actionLabel,
  icon,
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 300,
      p: 4,
    }}
  >
    <Box
      sx={{
        p: 3,
        borderRadius: '50%',
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        mb: 2,
      }}
    >
      {icon || <FolderOpen sx={{ fontSize: 64, color: 'primary.main' }} />}
    </Box>
    <Typography variant="h6" gutterBottom color="text.primary">
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3, maxWidth: 400 }}>
        {description}
      </Typography>
    )}
    {action && (
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={action}
      >
        {actionLabel || 'Add Item'}
      </Button>
    )}
  </Box>
);

export default EmptyState;