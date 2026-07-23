import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import DashboardCard from './DashboardCard';
import { CheckCircle, ErrorOutline, Warning, RestartAlt } from '@mui/icons-material';

const PodStat = ({ label, value, total, colorHex, icon }) => {
  const percent = total > 0 ? (value / total) * 100 : 0;
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '12px',
        border: '1px solid #F1F5F9',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        transition: 'background-color 0.15s',
        '&:hover': { bgcolor: '#F8FAFC' },
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          bgcolor: `${colorHex}12`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {React.cloneElement(icon, { sx: { color: colorHex, fontSize: 18 } })}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ color: '#64748B', fontSize: '0.7rem', fontWeight: 500 }}>{label}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
          <Typography sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.2rem', lineHeight: 1 }}>{value}</Typography>
          {total !== undefined && (
            <Typography sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>/ {total}</Typography>
          )}
        </Box>
      </Box>
      {total !== undefined && (
        <Box sx={{ width: 40, height: 4, bgcolor: '#F1F5F9', borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: `${Math.min(percent, 100)}%`, bgcolor: colorHex, borderRadius: 2 }} />
        </Box>
      )}
    </Box>
  );
};

const PodStatus = ({ data }) => {
  const totalPods = data.running + data.pending + data.failed + data.crashLoopBackOff;

  return (
    <DashboardCard title="Pod Status">
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6 }}>
          <PodStat label="Running" value={data.running} total={totalPods} colorHex="#22C55E" icon={<CheckCircle />} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <PodStat label="Pending" value={data.pending} total={totalPods} colorHex="#F59E0B" icon={<Warning />} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <PodStat label="Failed" value={data.failed} total={totalPods} colorHex="#EF4444" icon={<ErrorOutline />} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <PodStat label="Restarts (24h)" value={data.restartCount} colorHex="#6366F1" icon={<RestartAlt />} />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default PodStatus;
