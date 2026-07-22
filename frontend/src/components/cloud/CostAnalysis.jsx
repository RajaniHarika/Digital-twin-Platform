import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import CloudCard from './CloudCard';

const CostAnalysis = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <CloudCard title="Cost Analysis by Service">
      <Grid container spacing={2} alignItems="center" sx={{ height: '100%' }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                Total Cost
              </Typography>
              <Typography sx={{ color: '#0F172A', fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.2 }}>
                ${total.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {data.map((item) => (
                <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography sx={{ color: '#475569', fontSize: '0.75rem', fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#0F172A', fontSize: '0.75rem', fontWeight: 600 }}>
                    ${item.value.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </CloudCard>
  );
};

export default CostAnalysis;
