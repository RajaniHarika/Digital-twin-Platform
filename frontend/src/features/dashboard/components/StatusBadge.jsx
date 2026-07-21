import React from 'react';
import { Box, Typography } from '@mui/material';

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'running':
      case 'success':
      case 'active':
      case 'passed':
        return { color: '#15803D', bg: '#DCFCE7', dot: '#22C55E' };
      case 'warning':
      case 'pending':
      case 'queued':
      case 'updating':
        return { color: '#A16207', bg: '#FEF9C3', dot: '#F59E0B' };
      case 'critical':
      case 'failed':
      case 'error':
      case 'deprecated':
        return { color: '#B91C1C', bg: '#FEE2E2', dot: '#EF4444' };
      case 'info':
      case 'resolved':
        return { color: '#1D4ED8', bg: '#DBEAFE', dot: '#3B82F6' };
      case 'production':
        return { color: '#15803D', bg: '#DCFCE7', dot: '#22C55E' };
      default:
        return { color: '#374151', bg: '#F3F4F6', dot: '#9CA3AF' };
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
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: config.dot,
          flexShrink: 0,
        }}
      />
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
