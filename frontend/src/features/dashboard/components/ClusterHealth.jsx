import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';
import { Dns, Storage, Memory, DisplaySettings, SettingsSystemDaydream } from '@mui/icons-material';

const HealthNode = ({ name, status, healthPercent }) => {
  const isHealthy = healthPercent >= 95;
  const isWarning = healthPercent < 95 && healthPercent > 70;

  let Icon = Dns;
  if (name.includes('Worker')) Icon = Storage;
  else if (name.includes('API')) Icon = SettingsSystemDaydream;
  else if (name.includes('Scheduler')) Icon = DisplaySettings;
  else if (name.includes('etcd')) Icon = Memory;

  const barColor = isHealthy ? '#22C55E' : isWarning ? '#F59E0B' : '#EF4444';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1.5,
        mb: 1,
        borderRadius: '10px',
        border: '1px solid #F1F5F9',
        transition: 'background-color 0.15s ease',
        '&:hover': { bgcolor: '#F8FAFC' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            bgcolor: '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 16 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ color: '#0F172A', fontWeight: 600, fontSize: '0.8rem' }}>{name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Box sx={{ flex: 1, height: 3, bgcolor: '#F1F5F9', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${healthPercent}%`, bgcolor: barColor, borderRadius: 2 }} />
            </Box>
            <Typography sx={{ color: '#64748B', fontSize: '0.65rem', fontWeight: 600, flexShrink: 0 }}>
              {healthPercent}%
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ ml: 1.5, flexShrink: 0 }}>
        <StatusBadge status={status} />
      </Box>
    </Box>
  );
};

const ClusterHealth = ({ data }) => {
  return (
    <DashboardCard title="Kubernetes Cluster Health">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography sx={{ color: '#94A3B8', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
            Nodes
          </Typography>
          {data.nodes.map((node, index) => (
            <HealthNode key={`node-${index}`} {...node} />
          ))}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography sx={{ color: '#94A3B8', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
            Control Plane
          </Typography>
          {data.components.map((comp, index) => (
            <HealthNode key={`comp-${index}`} {...comp} />
          ))}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default ClusterHealth;
