import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Box
} from '@mui/material';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';

const DeploymentStatus = ({ data }) => {
  const headers = ['Service', 'Namespace', 'Version', 'Replicas', 'Status', 'Updated'];

  return (
    <DashboardCard title="Deployment Status" noPadding>
      <TableContainer
        sx={{
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#E2E8F0', borderRadius: 2 },
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              {headers.map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    bgcolor: '#F8FAFC',
                    color: '#94A3B8',
                    borderBottom: '1px solid #E2E8F0',
                    py: 1.25,
                    px: 2.5,
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
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  transition: 'background-color 0.15s',
                  '&:hover': { bgcolor: '#F8FAFC' },
                  '& td': { borderBottom: '1px solid #F1F5F9', py: 1.5, px: 2.5 },
                }}
              >
                <TableCell>
                  <Typography sx={{ color: '#0F172A', fontWeight: 600, fontSize: '0.8rem' }}>{row.name}</Typography>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: '8px',
                      py: '2px',
                      borderRadius: '6px',
                      bgcolor: '#F1F5F9',
                      color: '#334155',
                      fontSize: '0.7rem',
                      fontFamily: '"JetBrains Mono", "SF Mono", monospace',
                      fontWeight: 500,
                    }}
                  >
                    {row.namespace}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: '#64748B', fontSize: '0.75rem', fontFamily: '"JetBrains Mono", "SF Mono", monospace' }}>
                    {row.version}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: '#334155', fontSize: '0.8rem' }}>
                    <Box component="span" sx={{ color: row.available < row.replicas ? '#F59E0B' : '#22C55E', fontWeight: 700 }}>
                      {row.available}
                    </Box>
                    <Box component="span" sx={{ color: '#94A3B8', mx: 0.5 }}>/</Box>
                    {row.replicas}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>{row.lastUpdated}</Typography>
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
