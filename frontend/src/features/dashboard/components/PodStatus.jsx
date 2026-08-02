import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import DashboardCard from './DashboardCard';
import { CheckCircle, ErrorOutline, Warning, RestartAlt } from '@mui/icons-material';
import { useAppTheme } from '../../../theme/useAppTheme';

const PodStat = ({ label, value, total, colorHex, icon, tokens }) => {
  const percent = total > 0 ? (value / total) * 100 : 0;
  return (
    <Box
      sx={{
        p: 1.25,
        borderRadius: '10px',
        border: `1px solid ${tokens.border}`,
        bgcolor: tokens.surfaceMuted,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        height: '100%',
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '8px',
          bgcolor: `${colorHex}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {React.cloneElement(icon, { sx: { color: colorHex, fontSize: 16 } })}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ color: tokens.textSecondary, fontSize: '0.65rem', fontWeight: 500 }}>{label}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.35 }}>
          <Typography sx={{ color: tokens.text, fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.1 }}>{value}</Typography>
          {total !== undefined && (
            <Typography sx={{ color: tokens.textMuted, fontSize: '0.65rem' }}>/ {total}</Typography>
          )}
        </Box>
      </Box>
      {total !== undefined && (
        <Box sx={{ width: 36, height: 3, bgcolor: tokens.surface, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
          <Box sx={{ height: '100%', width: `${Math.min(percent, 100)}%`, bgcolor: colorHex, borderRadius: 2 }} />
        </Box>
      )}
    </Box>
  );
};

const PodStatus = ({ data }) => {
  const { tokens } = useAppTheme();
  const podData = data || {};
  const totalPods = (podData.running || 0) + (podData.pending || 0) + (podData.failed || 0) + (podData.crashLoopBackOff || 0);

  return (
    <DashboardCard title="Pod Status" compact>
      <Grid container spacing={1}>
        <Grid size={{ xs: 6 }}>
          <PodStat label="Running" value={podData.running || 0} total={totalPods} colorHex="#22C55E" icon={<CheckCircle />} tokens={tokens} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <PodStat label="Pending" value={podData.pending || 0} total={totalPods} colorHex="#F59E0B" icon={<Warning />} tokens={tokens} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <PodStat label="Failed" value={podData.failed || 0} total={totalPods} colorHex="#EF4444" icon={<ErrorOutline />} tokens={tokens} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <PodStat label="Restarts (24h)" value={podData.restartCount || 0} colorHex={tokens.accentDark} icon={<RestartAlt />} tokens={tokens} />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default PodStatus;
