import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';
import { useAppTheme } from '../../../theme/useAppTheme';

const PipelineCard = ({ pipeline, tokens }) => {
  const rateColor = pipeline.successRate > 90 ? '#22C55E' : pipeline.successRate > 75 ? '#F59E0B' : '#EF4444';

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: '10px',
        border: `1px solid ${tokens.border}`,
        bgcolor: tokens.surfaceMuted,
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 1 }}>
        <Typography sx={{ color: tokens.text, fontWeight: 600, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {pipeline.name}
        </Typography>
        <StatusBadge status={pipeline.status} />
      </Box>

      <Grid container spacing={1} sx={{ mb: 1 }}>
        <Grid size={{ xs: 4 }}>
          <Typography sx={{ color: tokens.textLabel, fontSize: '0.55rem', fontWeight: 600, textTransform: 'uppercase' }}>Stage</Typography>
          <Typography sx={{ color: tokens.textSecondary, fontSize: '0.7rem', fontWeight: 500 }}>{pipeline.stage}</Typography>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Typography sx={{ color: tokens.textLabel, fontSize: '0.55rem', fontWeight: 600, textTransform: 'uppercase' }}>Duration</Typography>
          <Typography sx={{ color: tokens.textSecondary, fontSize: '0.7rem', fontFamily: 'monospace' }}>{pipeline.duration}</Typography>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Typography sx={{ color: tokens.textLabel, fontSize: '0.55rem', fontWeight: 600, textTransform: 'uppercase' }}>Build</Typography>
          <Typography sx={{ color: tokens.accentDark, fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 600 }}>{pipeline.lastBuild}</Typography>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ flex: 1, height: 3, bgcolor: tokens.surface, borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: `${pipeline.successRate}%`, bgcolor: rateColor, borderRadius: 2 }} />
        </Box>
        <Typography sx={{ color: rateColor, fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>
          {pipeline.successRate}%
        </Typography>
      </Box>
    </Box>
  );
};

const JenkinsStatus = ({ data }) => {
  const { tokens } = useAppTheme();

  return (
    <DashboardCard title="CI/CD Pipelines" compact>
      <Grid container spacing={1}>
        {data?.map((pipeline) => (
          <Grid key={pipeline.id} size={{ xs: 12, sm: 6 }}>
            <PipelineCard pipeline={pipeline} tokens={tokens} />
          </Grid>
        ))}
      </Grid>
    </DashboardCard>
  );
};

export default JenkinsStatus;
