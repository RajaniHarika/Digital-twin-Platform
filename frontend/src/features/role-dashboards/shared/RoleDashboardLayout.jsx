import { Box, Typography, IconButton, Tooltip, Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAppTheme } from '../../../theme/useAppTheme';

const RoleDashboardLayout = ({
  title,
  subtitle,
  onRefresh,
  usingMock,
  children,
}) => {
  const { tokens } = useAppTheme();

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 1.5, md: 2 }, px: { xs: 1.5, md: 2 } }}>
      <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
        {usingMock && (
          <Alert severity="info" sx={{ mb: 2 }} action={onRefresh ? <Button color="inherit" size="small" onClick={onRefresh}>Retry</Button> : null}>
            Using demo data — connect the backend for live metrics.
          </Alert>
        )}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
            mb: 2.5,
            p: { xs: 2, md: 2.5 },
            bgcolor: tokens.paper,
            borderRadius: `${tokens.radii.xl}px`,
            border: `1px solid ${tokens.border}`,
            boxShadow: tokens.shadow,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {onRefresh && (
            <Tooltip title="Refresh">
              <IconButton onClick={onRefresh} sx={{ border: `1px solid ${tokens.border}` }}>
                <Refresh />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        {children}
      </Box>
    </Box>
  );
};

export default RoleDashboardLayout;
