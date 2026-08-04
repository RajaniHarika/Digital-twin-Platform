import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';
import { Dns, Storage, Memory, DisplaySettings, SettingsSystemDaydream } from '@mui/icons-material';
import { useAppTheme } from '../../../theme/useAppTheme';

const HealthNode = ({ name, status, healthPercent, tokens }) => {
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
        gap: 1,
        p: 1,
        mb: 0.75,
        borderRadius: '8px',
        border: `1px solid ${tokens.border}`,
        '&:hover': { bgcolor: tokens.surfaceHover },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '7px',
            bgcolor: tokens.surface,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tokens.textSecondary,
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 14 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ color: tokens.text, fontWeight: 600, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.35 }}>
            <Box sx={{ flex: 1, height: 3, bgcolor: tokens.surface, borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${healthPercent}%`, bgcolor: barColor, borderRadius: 2 }} />
            </Box>
            <Typography sx={{ color: tokens.textSecondary, fontSize: '0.6rem', fontWeight: 600, flexShrink: 0 }}>
              {healthPercent}%
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ flexShrink: 0 }}>
        <StatusBadge status={status} />
      </Box>
    </Box>
  );
};

const ClusterHealth = ({ data }) => {
  const { tokens } = useAppTheme();

  return (
    <DashboardCard title="Kubernetes Cluster Health" compact>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography sx={{ color: tokens.textLabel, fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
            Nodes
          </Typography>
          {data.nodes?.map((node, index) => (
            <HealthNode key={`node-${index}`} {...node} tokens={tokens} />
          ))}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography sx={{ color: tokens.textLabel, fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
            Control Plane
          </Typography>
          {data.components?.map((comp, index) => (
            <HealthNode key={`comp-${index}`} {...comp} tokens={tokens} />
          ))}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default ClusterHealth;
