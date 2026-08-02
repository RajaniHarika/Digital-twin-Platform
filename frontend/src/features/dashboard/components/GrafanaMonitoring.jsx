import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import DashboardCard from './DashboardCard';
import { MonitorHeart, Memory, Apps, Public, Speed, BugReport } from '@mui/icons-material';

const MetricTile = ({ title, value, icon, color }) => {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '12px',
        border: '1px solid #F1F5F9',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.15s ease',
        '&:hover': { bgcolor: '#F8FAFC' },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          bgcolor: color,
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography sx={{ color: '#94A3B8', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </Typography>
        <Box sx={{ color: '#CBD5E1' }}>{icon}</Box>
      </Box>
      <Typography sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
        {typeof value === 'number' && title !== 'Latency' && title !== 'Error Rate' && (
          <Typography component="span" sx={{ color: '#94A3B8', fontWeight: 600, fontSize: '0.8rem', ml: 0.25 }}>%</Typography>
        )}
      </Typography>
    </Box>
  );
};

const GrafanaMonitoring = ({ data }) => {
  return (
    <DashboardCard title="System Overview">
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <MetricTile title="Health" value={data.systemHealth} icon={<MonitorHeart sx={{ fontSize: 16 }} />} color="#22C55E" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <MetricTile title="Nodes" value={data.nodeMetrics} icon={<Memory sx={{ fontSize: 16 }} />} color="#3B82F6" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <MetricTile title="Apps" value={data.appMetrics} icon={<Apps sx={{ fontSize: 16 }} />} color="#8B5CF6" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <MetricTile title="Uptime" value={data.serviceAvailability} icon={<Public sx={{ fontSize: 16 }} />} color="#22C55E" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <MetricTile title="Latency" value={data.latency} icon={<Speed sx={{ fontSize: 16 }} />} color="#F59E0B" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <MetricTile title="Error Rate" value={`${data.errorRate}%`} icon={<BugReport sx={{ fontSize: 16 }} />} color="#EF4444" />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default GrafanaMonitoring;
