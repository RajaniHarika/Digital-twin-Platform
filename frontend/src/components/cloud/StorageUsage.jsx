import React from 'react';
import { Box, Typography } from '@mui/material';
import CloudCard from './CloudCard';
import { useAppTheme } from '../../theme/useAppTheme';

const StorageUsage = ({ data }) => {
  const { tokens } = useAppTheme();

  return (
    <CloudCard title="Storage Usage Overview">
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ color: tokens.text, fontWeight: 700, fontSize: '1.25rem' }}>
            {data.used} TB <Typography component="span" sx={{ color: tokens.textLabel, fontSize: '0.875rem', fontWeight: 500 }}>used</Typography>
          </Typography>
          <Typography sx={{ color: tokens.text, fontWeight: 700, fontSize: '1.25rem' }}>
            {data.total} TB <Typography component="span" sx={{ color: tokens.textLabel, fontSize: '0.875rem', fontWeight: 500 }}>total</Typography>
          </Typography>
        </Box>

        <Box sx={{ width: '100%', height: 16, bgcolor: tokens.surface, borderRadius: 8, overflow: 'hidden', display: 'flex', mb: 3 }}>
          {data.breakdown.map((item) => (
            <Box
              key={item.type}
              sx={{
                height: '100%',
                width: `${(item.value / data.total) * 100}%`,
                bgcolor: item.color,
                transition: 'width 0.5s ease',
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {data.breakdown.map((item) => (
            <Box key={item.type} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: item.color }} />
                <Typography sx={{ color: tokens.textLabel, fontSize: '0.75rem', fontWeight: 600 }}>
                  {item.type}
                </Typography>
              </Box>
              <Typography sx={{ color: tokens.text, fontSize: '0.75rem', fontWeight: 700 }}>
                {item.value} TB <Typography component="span" sx={{ color: tokens.textLabel, fontWeight: 500, fontSize: '0.65rem' }}>({((item.value / data.total) * 100).toFixed(1)}%)</Typography>
              </Typography>
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: `1px dashed ${tokens.border}` }}>
            <Typography sx={{ color: tokens.textLabel, fontSize: '0.75rem', fontWeight: 600 }}>Available</Typography>
            <Typography sx={{ color: '#94C600', fontSize: '0.75rem', fontWeight: 700 }}>
              {data.total - data.used} TB
            </Typography>
          </Box>
        </Box>
      </Box>
    </CloudCard>
  );
};

export default StorageUsage;
