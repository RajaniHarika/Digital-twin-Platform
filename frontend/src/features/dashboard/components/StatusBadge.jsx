import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

const StatusBadge = ({ status }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'running':
      case 'success':
      case 'active':
      case 'passed':
        return {
          color: isDark ? '#C7FF3A' : '#94C600',
          bg: isDark ? alpha('#C7FF3A', 0.12) : '#ECFFB6',
          dot: '#C7FF3A',
        };
      case 'warning':
      case 'pending':
      case 'queued':
      case 'updating':
        return {
          color: isDark ? '#FBBF24' : '#A16207',
          bg: isDark ? alpha('#F59E0B', 0.12) : '#FEF9C3',
          dot: '#F59E0B',
        };
      case 'critical':
      case 'failed':
      case 'error':
      case 'deprecated':
        return {
          color: isDark ? '#F87171' : '#B91C1C',
          bg: isDark ? alpha('#EF4444', 0.12) : '#FEE2E2',
          dot: '#EF4444',
        };
      case 'info':
      case 'resolved':
      case 'production':
        return {
          color: isDark ? '#C7FF3A' : '#94C600',
          bg: isDark ? alpha('#C7FF3A', 0.12) : '#ECFFB6',
          dot: '#C7FF3A',
        };
      default:
        return {
          color: theme.palette.text.secondary,
          bg: isDark ? alpha('#FFFFFF', 0.06) : '#FCFBF8',
          dot: theme.palette.text.disabled,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        px: 1,
        py: '3px',
        borderRadius: '6px',
        bgcolor: config.bg,
        lineHeight: 1,
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: config.dot, flexShrink: 0 }} />
      <Typography
        sx={{
          color: config.color,
          fontWeight: 600,
          fontSize: '0.7rem',
          letterSpacing: '0.01em',
          textTransform: 'capitalize',
          lineHeight: 1.4,
        }}
      >
        {status}
      </Typography>
    </Box>
  );
};

export default StatusBadge;
