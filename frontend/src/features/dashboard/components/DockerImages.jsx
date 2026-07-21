import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';
import { Shield, Inventory2 } from '@mui/icons-material';

const DockerImages = ({ data }) => {
  return (
    <DashboardCard title="Container Registry">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {data.map((image) => {
          const scanColor = image.securityScan === 'Passed' ? '#22C55E' : image.securityScan === 'Warning' ? '#F59E0B' : '#EF4444';

          return (
            <Box
              key={image.id}
              sx={{
                p: 1.5,
                borderRadius: '10px',
                border: '1px solid #F1F5F9',
                transition: 'background-color 0.15s ease',
                '&:hover': { bgcolor: '#F8FAFC' },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      bgcolor: '#F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Inventory2 sx={{ fontSize: 16, color: '#64748B' }} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: '#0F172A',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {image.repository.split('/').pop()}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                      <Box
                        sx={{
                          px: '6px',
                          py: '1px',
                          borderRadius: '4px',
                          bgcolor: '#EEF2FF',
                          color: '#2563EB',
                          fontSize: '0.6rem',
                          fontFamily: 'monospace',
                          fontWeight: 600,
                        }}
                      >
                        {image.tag}
                      </Box>
                      <Typography sx={{ color: '#94A3B8', fontSize: '0.65rem' }}>{image.size}</Typography>
                    </Box>
                  </Box>
                </Box>
                <StatusBadge status={image.status} />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #F8FAFC' }}>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.65rem' }}>{image.lastUpdated}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Shield sx={{ fontSize: 14, color: scanColor }} />
                  <Typography sx={{ color: scanColor, fontSize: '0.65rem', fontWeight: 600 }}>
                    {image.securityScan}
                  </Typography>
                  {image.vulnerabilities > 0 && (
                    <Box
                      sx={{
                        px: '6px',
                        py: '1px',
                        borderRadius: '4px',
                        bgcolor: '#FEF2F2',
                        color: '#EF4444',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                      }}
                    >
                      {image.vulnerabilities}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </DashboardCard>
  );
};

export default DockerImages;
