import React from 'react';
import { Box, Typography, Button, Select, MenuItem, FormControl } from '@mui/material';
import { Refresh, Cloud } from '@mui/icons-material';
import { useAppTheme } from '../../theme/useAppTheme';

const CloudHeader = ({ data, onRefresh }) => {
  const { tokens } = useAppTheme();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: tokens.surfaceMuted, px: 2, py: 1, borderRadius: 2, border: `1px solid ${tokens.border}` }}>
          <Cloud sx={{ color: '#F59E0B' }} />
          <Typography sx={{ fontWeight: 700, color: tokens.textSecondary }}>{data.provider}</Typography>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: tokens.text, letterSpacing: '-0.02em' }}>
          {data.title}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select value={data.region} sx={{ bgcolor: tokens.paper, color: tokens.textSecondary, fontWeight: 500, fontSize: '0.875rem' }}>
            <MenuItem value="us-east-1">US East (N. Virginia)</MenuItem>
            <MenuItem value="ap-south-1">Asia Pacific (Mumbai)</MenuItem>
            <MenuItem value="eu-central-1">EU (Frankfurt)</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" startIcon={<Refresh />} onClick={onRefresh} sx={{ color: tokens.textSecondary, borderColor: tokens.border, textTransform: 'none', fontWeight: 600 }}>
          Refresh Data
        </Button>
        <Button variant="contained" onClick={() => window.open('https://console.aws.amazon.com/ec2/', '_blank', 'noopener')} sx={{ bgcolor: tokens.accent, color: '#111111', textTransform: 'none', fontWeight: 600, borderRadius: '999px' }}>
          Manage Resources
        </Button>
      </Box>
    </Box>
  );
};

export default CloudHeader;
