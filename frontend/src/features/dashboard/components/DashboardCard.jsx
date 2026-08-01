import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useAppTheme } from '../../../theme/useAppTheme';

const DashboardCard = ({ title, action, children, sx = {}, noPadding = false, compact = false }) => {
  const { tokens } = useAppTheme();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      sx={{
        bgcolor: tokens.paper,
        borderRadius: `${tokens.radii.xl}px`,
        border: `1px solid ${tokens.border}`,
        boxShadow: tokens.shadow,
        overflow: 'hidden',
        transition: tokens.transitions.default,
        '&:hover': {
          boxShadow: tokens.shadowHover,
          transform: 'translateY(-3px)',
        },
        ...sx,
      }}
    >
      {title && (
        <Box
          sx={{
            px: compact ? 2 : 2.5,
            py: compact ? 1.25 : 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${tokens.border}`,
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              color: tokens.textLabel,
              fontWeight: 600,
              fontSize: '0.72rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </Typography>
          {action && <Box>{action}</Box>}
        </Box>
      )}
      <Box sx={{ p: noPadding ? 0 : compact ? { xs: 1.5, md: 2 } : { xs: 2, md: 2.5 } }}>
        {children}
      </Box>
    </Box>
  );
};

export default DashboardCard;
