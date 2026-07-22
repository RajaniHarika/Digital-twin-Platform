import React from 'react';
import { Box, Typography, Button, Select, MenuItem, FormControl } from '@mui/material';
import { Refresh, Cloud } from '@mui/icons-material';

const CloudHeader = ({ data }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#F8FAFC', px: 2, py: 1, borderRadius: 2, border: '1px solid #E2E8F0' }}>
          <Cloud sx={{ color: '#F59E0B' }} />
          <Typography sx={{ fontWeight: 700, color: '#334155' }}>{data.provider}</Typography>
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
            {data.title}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={data.region}
            displayEmpty
            sx={{
              bgcolor: '#FFFFFF',
              color: '#334155',
              fontWeight: 500,
              fontSize: '0.875rem',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }
            }}
          >
            <MenuItem value="us-east-1">US East (N. Virginia)</MenuItem>
            <MenuItem value="us-west-2">US West (Oregon)</MenuItem>
            <MenuItem value="eu-central-1">EU (Frankfurt)</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          sx={{
            color: '#64748B',
            borderColor: '#E2E8F0',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' }
          }}
        >
          Refresh Data
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#3B82F6',
            color: '#FFF',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#2563EB', boxShadow: 'none' }
          }}
        >
          Manage Resources
        </Button>
      </Box>
    </Box>
  );
};

export default CloudHeader;
