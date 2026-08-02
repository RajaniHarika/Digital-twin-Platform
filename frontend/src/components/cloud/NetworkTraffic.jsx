import React from 'react';
import { Box, Typography } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import CloudCard from './CloudCard';

const CustomTooltip = ({ active, payload, label }) => {
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
              {entry.name}: {entry.value} GB
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

const NetworkTraffic = ({ data }) => {
  return (
    <CloudCard title="Network Traffic (Inbound/Outbound)">
      <Box sx={{ height: 300, width: '100%', mt: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="time" stroke="#CBD5E1" fontSize={10} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#CBD5E1" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E2E8F0', strokeDasharray: '3 3' }} />
            <Area
              type="monotone"
              dataKey="inbound"
              name="Inbound"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorInbound)"
              activeDot={{ r: 4, strokeWidth: 0, fill: '#3B82F6' }}
            />
            <Area
              type="monotone"
              dataKey="outbound"
              name="Outbound"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOutbound)"
              activeDot={{ r: 4, strokeWidth: 0, fill: '#10B981' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </CloudCard>
  );
};

export default NetworkTraffic;
