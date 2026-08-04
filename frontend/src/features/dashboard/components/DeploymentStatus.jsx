import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from '@mui/material';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';
import { useAppTheme } from '../../../theme/useAppTheme';

const DeploymentStatus = ({ data }) => {
  const { tokens } = useAppTheme();
  const headers = ['Service', 'Namespace', 'Version', 'Replicas', 'Status', 'Updated'];

  return (
    <DashboardCard title="Deployment Status" compact noPadding>
      <TableContainer
        sx={{
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: tokens.surface, borderRadius: 2 },
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              {headers.map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    bgcolor: tokens.surfaceMuted,
                    color: tokens.textLabel,
                    borderBottom: `1px solid ${tokens.border}`,
                    py: 1,
                    px: 2,
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  transition: 'background-color 0.15s',
                  '&:hover': { bgcolor: tokens.surfaceHover },
                  '& td': { borderBottom: `1px solid ${tokens.border}`, py: 1.1, px: 2 },
                }}
              >
                <TableCell>
                  <Typography sx={{ color: tokens.text, fontWeight: 600, fontSize: '0.8rem' }}>{row.name}</Typography>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: '8px',
                      py: '2px',
                      borderRadius: '6px',
                      bgcolor: tokens.surface,
                      color: tokens.textSecondary,
                      fontSize: '0.7rem',
                      fontFamily: '"JetBrains Mono", "SF Mono", monospace',
                      fontWeight: 500,
                    }}
                  >
                    {row.namespace}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: tokens.textSecondary, fontSize: '0.75rem', fontFamily: '"JetBrains Mono", "SF Mono", monospace' }}>
                    {row.version}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: tokens.textSecondary, fontSize: '0.8rem' }}>
                    <Box component="span" sx={{ color: row.available < row.replicas ? '#F59E0B' : '#22C55E', fontWeight: 700 }}>
                      {row.available}
                    </Box>
                    <Box component="span" sx={{ color: tokens.textMuted, mx: 0.5 }}>/</Box>
                    {row.replicas}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: tokens.textMuted, fontSize: '0.7rem' }}>{row.lastUpdated}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default DeploymentStatus;
