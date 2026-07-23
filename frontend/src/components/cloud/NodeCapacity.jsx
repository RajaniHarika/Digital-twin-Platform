import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from '@mui/material';
import { Dns, CheckCircle, Warning, Cancel } from '@mui/icons-material';
import { motion } from 'framer-motion';
import CloudCard from './CloudCard';

const CapacityBar = ({ value, colorHex }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box sx={{ flex: 1, height: 6, bgcolor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
      <Box
        sx={{
          height: '100%',
          width: `${value}%`,
          bgcolor: value > 85 ? '#EF4444' : value > 65 ? '#F59E0B' : colorHex,
          borderRadius: 3,
          transition: 'width 0.4s ease',
        }}
      />
    </Box>
    <Typography sx={{ color: '#64748B', fontSize: '0.65rem', fontWeight: 600, width: 28, textAlign: 'right' }}>
      {value}%
    </Typography>
  </Box>
);

const STATUS_CONFIG = {
  running: { label: 'Running', bgColor: '#DCFCE7', textColor: '#15803D', dotColor: '#22C55E' },
  warning: { label: 'Warning', bgColor: '#FEF3C7', textColor: '#92400E', dotColor: '#F59E0B' },
  stopped: { label: 'Stopped', bgColor: '#FEE2E2', textColor: '#991B1B', dotColor: '#EF4444' },
};

const StatusChip = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.stopped;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.25,
        py: 0.4,
        borderRadius: '8px',
        bgcolor: config.bgColor,
        color: config.textColor,
        fontSize: '0.65rem',
        fontWeight: 600,
        textTransform: 'capitalize',
        letterSpacing: '0.02em',
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: config.dotColor }} />
      {config.label}
    </Box>
  );
};

const SummaryCard = ({ icon, label, count, colorHex, delay = 0 }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, delay }}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      p: 1.5,
      borderRadius: '12px',
      bgcolor: `${colorHex}08`,
      border: `1px solid ${colorHex}20`,
    }}
  >
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: '10px',
        bgcolor: `${colorHex}14`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {React.cloneElement(icon, { sx: { color: colorHex, fontSize: 18 } })}
    </Box>
    <Box>
      <Typography sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.1 }}>
        {count}
      </Typography>
      <Typography sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </Typography>
    </Box>
  </Box>
);

const NodeCapacity = ({ data }) => {
  const totalNodes = data.length;
  const healthyNodes = data.filter((n) => n.state === 'running').length;
  const warningNodes = data.filter((n) => n.state === 'warning').length;
  const offlineNodes = data.filter((n) => n.state === 'stopped').length;

  return (
    <CloudCard title="Node Capacity">
      {/* Summary Statistics */}
      <Box sx={{ mb: 2.5 }}>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <SummaryCard icon={<Dns />} label="Total Nodes" count={totalNodes} colorHex="#3B82F6" delay={0} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <SummaryCard icon={<CheckCircle />} label="Healthy" count={healthyNodes} colorHex="#22C55E" delay={0.05} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <SummaryCard icon={<Warning />} label="Warning" count={warningNodes} colorHex="#F59E0B" delay={0.1} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <SummaryCard icon={<Cancel />} label="Offline" count={offlineNodes} colorHex="#EF4444" delay={0.15} />
          </Grid>
        </Grid>
      </Box>

      {/* Node Table */}
      <TableContainer
        sx={{
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          '&::-webkit-scrollbar': { width: 4, height: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#E2E8F0', borderRadius: 2 },
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Node Name', 'Status', 'CPU', 'Memory', 'Storage', 'Network'].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    bgcolor: '#F8FAFC',
                    color: '#94A3B8',
                    borderBottom: '1px solid #E2E8F0',
                    py: 1.5,
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
            {data.map((node) => (
              <TableRow
                key={node.id}
                sx={{
                  transition: 'background-color 0.15s',
                  '&:hover': { bgcolor: '#F8FAFC' },
                  '& td': { borderBottom: '1px solid #F1F5F9', py: 1.5, px: 2 },
                }}
              >
                <TableCell>
                  <Typography sx={{ color: '#0F172A', fontWeight: 600, fontSize: '0.75rem', fontFamily: '"JetBrains Mono", monospace' }}>
                    {node.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusChip status={node.state} />
                </TableCell>
                <TableCell sx={{ minWidth: 100 }}>
                  <CapacityBar value={node.cpu} colorHex="#3B82F6" />
                </TableCell>
                <TableCell sx={{ minWidth: 100 }}>
                  <CapacityBar value={node.memory} colorHex="#8B5CF6" />
                </TableCell>
                <TableCell sx={{ minWidth: 100 }}>
                  <CapacityBar value={node.storage} colorHex="#10B981" />
                </TableCell>
                <TableCell sx={{ minWidth: 100 }}>
                  <CapacityBar value={node.network} colorHex="#F59E0B" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CloudCard>
  );
};

export default NodeCapacity;
