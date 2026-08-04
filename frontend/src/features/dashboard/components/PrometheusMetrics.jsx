import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import DashboardCard from './DashboardCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAppTheme } from '../../../theme/useAppTheme';

const CHART_HEIGHT = 168;

const CustomTooltip = ({ active, payload, label, unit = '%', tokens }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: tokens.tooltipBg,
          p: 1.25,
          border: `1px solid ${tokens.border}`,
          borderRadius: '10px',
          boxShadow: tokens.shadow,
        }}
      >
        <Typography sx={{ color: tokens.textMuted, fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '3px', bgcolor: entry.color }} />
            <Typography sx={{ color: tokens.text, fontWeight: 600, fontSize: '0.75rem' }}>
              {entry.value}{unit}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

const MetricChart = ({ title, data, dataKey, color, unit = '%', tokens }) => (
  <Box
    sx={{
      p: 1.5,
      borderRadius: '12px',
      border: `1px solid ${tokens.border}`,
      bgcolor: tokens.surfaceMuted,
      height: '100%',
    }}
  >
    <Typography sx={{ color: tokens.textSecondary, fontWeight: 600, fontSize: '0.75rem', mb: 1 }}>{title}</Typography>
    <Box sx={{ width: '100%', height: CHART_HEIGHT }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={tokens.chartGrid} vertical={false} />
          <XAxis dataKey="time" stroke={tokens.chartGrid} fontSize={9} tickLine={false} axisLine={false} dy={6} interval="preserveStartEnd" tick={{ fill: tokens.textMuted }} />
          <YAxis stroke={tokens.chartGrid} fontSize={9} tickLine={false} axisLine={false} width={32} tick={{ fill: tokens.textMuted }} />
          <Tooltip content={<CustomTooltip unit={unit} tokens={tokens} />} cursor={{ stroke: tokens.chartGrid, strokeDasharray: '3 3' }} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#gradient-${dataKey})`}
            activeDot={{ r: 3, strokeWidth: 0, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  </Box>
);

const PrometheusMetrics = ({ data }) => {
  const { tokens } = useAppTheme();

  return (
    <DashboardCard title="Resource Metrics" compact>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricChart title="CPU Utilization" data={data.cpu} dataKey="usage" color="#C7FF3A" tokens={tokens} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricChart title="Memory Utilization" data={data.memory} dataKey="usage" color={tokens.textSecondary} tokens={tokens} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricChart title="Network I/O" data={data.network} dataKey="in" color="#22C55E" unit=" Mbps" tokens={tokens} />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default PrometheusMetrics;
