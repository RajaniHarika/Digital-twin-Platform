import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';

const JenkinsStatus = ({ data }) => {
  return (
    <DashboardCard title="CI/CD Pipelines">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {data.map((pipeline) => {
          const rateColor = pipeline.successRate > 90 ? '#22C55E' : pipeline.successRate > 75 ? '#F59E0B' : '#EF4444';

          return (
            <Box
              key={pipeline.id}
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid #F1F5F9',
                transition: 'background-color 0.15s ease',
                '&:hover': { bgcolor: '#F8FAFC' },
              }}
            >
              {/* Row 1: Name + Status */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ color: '#0F172A', fontWeight: 600, fontSize: '0.8rem' }}>
                  {pipeline.name}
                </Typography>
                <StatusBadge status={pipeline.status} />
              </Box>

              {/* Row 2: Metadata */}
              <Box sx={{ display: 'flex', gap: 3, mb: 1.5 }}>
                <Box>
                  <Typography sx={{ color: '#94A3B8', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Stage
                  </Typography>
                  <Typography sx={{ color: '#334155', fontSize: '0.75rem', fontWeight: 500, mt: 0.25 }}>{pipeline.stage}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: '#94A3B8', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Duration
                  </Typography>
                  <Typography sx={{ color: '#334155', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 500, mt: 0.25 }}>
                    {pipeline.duration}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: '#94A3B8', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Build
                  </Typography>
                  <Typography sx={{ color: '#2563EB', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600, mt: 0.25 }}>
                    {pipeline.lastBuild}
                  </Typography>
                </Box>
              </Box>

              {/* Row 3: Progress bar */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ flex: 1, height: 4, bgcolor: '#F1F5F9', borderRadius: 2, overflow: 'hidden' }}>
                  <Box sx={{ height: '100%', width: `${pipeline.successRate}%`, bgcolor: rateColor, borderRadius: 2 }} />
                </Box>
                <Typography sx={{ color: rateColor, fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                  {pipeline.successRate}%
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </DashboardCard>
  );
};

export default JenkinsStatus;
