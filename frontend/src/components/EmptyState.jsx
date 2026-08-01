import { Box, Typography, Button } from '@mui/material';
import { InboxOutlined, Refresh } from '@mui/icons-material';

const EmptyState = ({ title = 'No data available', description, actionLabel, onAction, icon }) => (
  <Box
    sx={{
      py: 6,
      px: 3,
      textAlign: 'center',
      borderRadius: 3,
      border: (theme) => `1px dashed ${theme.palette.divider}`,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(17,17,17,0.02)'),
    }}
  >
    {icon || <InboxOutlined sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />}
    <Typography variant="h6" fontWeight={600} gutterBottom>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', mb: 2 }}>
        {description}
      </Typography>
    )}
    {actionLabel && onAction && (
      <Button variant="outlined" startIcon={<Refresh />} onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default EmptyState;
