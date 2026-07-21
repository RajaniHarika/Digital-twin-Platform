import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const DashboardCard = ({ title, action, children, sx = {}, noPadding = false }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          borderColor: '#CBD5E1',
        },
        ...sx,
      }}
    >
      {title && (
        <Box
          sx={{
            px: 2.5,
            py: 1.75,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #F1F5F9',
          }}
        >
          <Typography
            sx={{
              color: '#334155',
              fontWeight: 600,
              fontSize: '0.8rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </Typography>
          {action && <Box>{action}</Box>}
        </Box>
      )}
      <Box
        sx={{
          p: noPadding ? 0 : 2.5,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardCard;
