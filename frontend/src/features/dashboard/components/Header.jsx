import React from 'react';
import { Box, Typography, Chip, useTheme, alpha } from '@mui/material';
import { Hub } from '@mui/icons-material';

const Header = ({ welcomeMessage, clusterHealthBadge, clusterHealthScore }) => {
  const theme = useTheme();
  
  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        mb: 4,
        p: 3,
        borderRadius: 2,
        background: isDark 
          ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.4) 0%, rgba(20, 20, 20, 0.6) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 244, 248, 0.8) 100%)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
        boxShadow: isDark 
          ? '0 4px 20px rgba(0, 0, 0, 0.2)' 
          : '0 4px 20px rgba(31, 38, 135, 0.04)',
      }}
    >
      <Box>
        <Typography 
          variant="h4" 
          fontWeight={800} 
          sx={{ 
            color: 'text.primary',
            background: isDark
              ? 'linear-gradient(45deg, #64B5F6 30%, #BA68C8 90%)'
              : 'linear-gradient(45deg, #1976D2 30%, #9C27B0 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}
        >
          DevOps Engineer Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
          {welcomeMessage}
        </Typography>
      </Box>

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2, 
          alignItems: { xs: 'flex-start', sm: 'center' },
          width: { xs: '100%', md: 'auto' }
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
          {currentDate}
        </Typography>
        
        <Chip
          icon={<Hub sx={{ color: '#4CAF50 !important' }} />}
          label={`Cluster Health: ${clusterHealthBadge} (${clusterHealthScore}%)`}
          sx={{
            fontWeight: 700,
            fontSize: '0.85rem',
            px: 1,
            py: 2,
            borderRadius: '10px',
            bgcolor: isDark ? 'rgba(76, 175, 80, 0.15)' : 'rgba(76, 175, 80, 0.1)',
            color: isDark ? '#81C784' : '#2E7D32',
            border: `1px solid ${isDark ? 'rgba(129, 199, 132, 0.3)' : 'rgba(46, 125, 50, 0.2)'}`,
            boxShadow: isDark 
              ? '0 0 12px rgba(76, 175, 80, 0.2)' 
              : 'none',
          }}
        />
      </Box>
    </Box>
  );
};

export default React.memo(Header);
