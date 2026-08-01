import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import DashboardCard from './DashboardCard';
import { MonitorHeart, Memory, Apps, Public, Speed, BugReport } from '@mui/icons-material';
import { useAppTheme } from '../../../theme/useAppTheme';

const MetricTile = ({ title, value, icon, color, isString = false, tokens }) => (
  <Box
    sx={{
      p: 1.5,
      borderRadius: '10px',
      border: `1px solid ${tokens.border}`,
      bgcolor: tokens.surfaceMuted,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
      minHeight: 88,
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        bgcolor: color,
      },
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
      <Typography sx={{ color: tokens.textLabel, fontSize: '0.58rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </Typography>
      <Box sx={{ color: tokens.surface }}>{icon}</Box>
    </Box>
    <Typography
      sx={{
        color: tokens.text,
        fontWeight: 700,
        fontSize: isString ? '0.95rem' : '1.25rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        wordBreak: 'break-word',
      }}
    >
      {value}
      {!isString && typeof value === 'number' && title !== 'Latency' && title !== 'Error Rate' && (
        <Typography component="span" sx={{ color: tokens.textMuted, fontWeight: 600, fontSize: '0.75rem', ml: 0.25 }}>%</Typography>
      )}
    </Typography>
  </Box>
);

const GrafanaMonitoring = ({ data }) => {
  const { tokens } = useAppTheme();

  return (
    <DashboardCard title="System Overview" compact>
      <Grid container spacing={1}>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <MetricTile title="Health" value={data.systemHealth} icon={<MonitorHeart sx={{ fontSize: 14 }} />} color="#22C55E" tokens={tokens} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <MetricTile title="Nodes" value={data.nodeMetrics} icon={<Memory sx={{ fontSize: 14 }} />} color={tokens.textSecondary} isString tokens={tokens} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <MetricTile title="Apps" value={data.appMetrics} icon={<Apps sx={{ fontSize: 14 }} />} color={tokens.textSecondary} isString tokens={tokens} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <MetricTile title="Uptime" value={data.serviceAvailability} icon={<Public sx={{ fontSize: 14 }} />} color="#22C55E" tokens={tokens} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <MetricTile title="Latency" value={data.latency} icon={<Speed sx={{ fontSize: 14 }} />} color="#F59E0B" isString tokens={tokens} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <MetricTile title="Error Rate" value={`${data.errorRate}%`} icon={<BugReport sx={{ fontSize: 14 }} />} color="#EF4444" isString tokens={tokens} />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default GrafanaMonitoring;
