import React from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import CloudCard from './CloudCard';

const CircularUtilization = ({ label, value, colorHex }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1 }}>
    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={80}
        thickness={4.5}
        sx={{ color: '#F1F5F9' }}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        size={80}
        thickness={4.5}
        sx={{
          color: colorHex,
          position: 'absolute',
          left: 0,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.1rem' }}>
          {value}%
        </Typography>
      </Box>
    </Box>
    <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </Typography>
  </Box>
);

const ResourceUtilization = ({ data }) => {
  return (
    <CloudCard title="Resource Utilization">
      <Grid container spacing={1} justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <CircularUtilization label="CPU" value={data.cpu} colorHex="#3B82F6" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <CircularUtilization label="Memory" value={data.memory} colorHex="#8B5CF6" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <CircularUtilization label="Disk" value={data.disk} colorHex="#10B981" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <CircularUtilization label="Network" value={data.network} colorHex="#F59E0B" />
        </Grid>
      </Grid>
    </CloudCard>
  );
};

export default ResourceUtilization;
