import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import DashboardCard from './DashboardCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload, label, unit = '%' }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          p: 1.5,
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <Typography sx={{ color: '#94A3B8', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '3px', bgcolor: entry.color }} />
            <Typography sx={{ color: '#0F172A', fontWeight: 600, fontSize: '0.75rem' }}>
              {entry.value}{unit}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

const MetricChart = ({ title, data, dataKey, color, unit = '%' }) => {
  return (
    <Box sx={{ height: '100%', minHeight: 260, display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', mb: 2 }}>{title}</Typography>
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="time" stroke="#CBD5E1" fontSize={10} tickLine={false} axisLine={false} dy={8} />
            <YAxis stroke="#CBD5E1" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ stroke: '#E2E8F0', strokeDasharray: '3 3' }} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${dataKey})`}
              activeDot={{ r: 4, strokeWidth: 0, fill: color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

const PrometheusMetrics = ({ data }) => {
  return (
    <DashboardCard title="Resource Metrics">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricChart title="CPU Utilization" data={data.cpu} dataKey="usage" color="#2563EB" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricChart title="Memory Utilization" data={data.memory} dataKey="usage" color="#8B5CF6" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricChart title="Network I/O" data={data.network} dataKey="in" color="#22C55E" unit=" Mbps" />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default PrometheusMetrics;
