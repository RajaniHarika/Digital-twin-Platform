import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { alpha } from '@mui/material/styles';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';
import { Shield, Inventory2 } from '@mui/icons-material';
import { useAppTheme } from '../../../theme/useAppTheme';

const ImageCard = ({ image, tokens, isDark }) => {
  const scanColor = image.securityScan === 'Passed' ? '#22C55E' : image.securityScan === 'Warning' ? '#F59E0B' : '#EF4444';

  return (
    <Box
      sx={{
        p: 1.25,
        borderRadius: '10px',
        border: `1px solid ${tokens.border}`,
        bgcolor: tokens.surfaceMuted,
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 0.75 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '7px',
              bgcolor: tokens.surface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Inventory2 sx={{ fontSize: 14, color: tokens.textSecondary }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: tokens.text, fontWeight: 600, fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {image.repository.split('/').pop()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2 }}>
              <Box sx={{ px: '5px', py: '1px', borderRadius: '4px', bgcolor: tokens.accentLight, color: tokens.accentDark, fontSize: '0.58rem', fontFamily: 'monospace', fontWeight: 600 }}>
                {image.tag}
              </Box>
              <Typography sx={{ color: tokens.textMuted, fontSize: '0.6rem' }}>{image.size}</Typography>
            </Box>
          </Box>
        </Box>
        <StatusBadge status={image.status} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.75, borderTop: `1px solid ${tokens.border}` }}>
        <Typography sx={{ color: tokens.textMuted, fontSize: '0.6rem' }}>{image.lastUpdated}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Shield sx={{ fontSize: 12, color: scanColor }} />
          <Typography sx={{ color: scanColor, fontSize: '0.6rem', fontWeight: 600 }}>{image.securityScan}</Typography>
          {image.vulnerabilities > 0 && (
            <Box sx={{ px: '5px', py: '1px', borderRadius: '4px', bgcolor: isDark ? alpha('#EF4444', 0.15) : '#FEF2F2', color: '#EF4444', fontSize: '0.55rem', fontWeight: 700 }}>
              {image.vulnerabilities}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const DockerImages = ({ data }) => {
  const { tokens, isDark } = useAppTheme();

  return (
    <DashboardCard title="Container Registry" compact>
      <Grid container spacing={1}>
        {data?.map((image) => (
          <Grid key={image.id} size={{ xs: 12, sm: 6 }}>
            <ImageCard image={image} tokens={tokens} isDark={isDark} />
          </Grid>
        ))}
      </Grid>
    </DashboardCard>
  );
};

export default DockerImages;
