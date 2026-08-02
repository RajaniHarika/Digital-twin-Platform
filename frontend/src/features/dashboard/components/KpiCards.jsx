import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import {
  CheckCircleOutline, RocketLaunch, Speed, Memory, NotificationsActive, AltRoute,
  TrendingUp
} from '@mui/icons-material';

const generateSparkline = (base, volatility) => {
  return Array.from({ length: 15 }).map((_, i) => ({
    val: base + Math.sin(i) * volatility + Math.random() * (volatility / 2),
  }));
};

const KpiWidget = ({ title, value, colorHex, icon, sparklineData, delay = 0 }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      sx={{
        p: 2.5,
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          borderColor: '#CBD5E1',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                bgcolor: `${colorHex}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {React.cloneElement(icon, { sx: { color: colorHex, fontSize: 16 } })}
            </Box>
            <Typography sx={{ color: '#64748B', fontWeight: 500, fontSize: '0.75rem' }}>{title}</Typography>
          </Box>
          <Typography sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ width: 64, height: 36, mt: 0.5 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`kpi-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorHex} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={colorHex} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="val" stroke={colorHex} strokeWidth={1.5} fillOpacity={1} fill={`url(#kpi-${title.replace(/\s+/g, '')})`} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

const KpiCards = ({ data }) => {
  const kpis = [
    { title: 'Pods Running', value: data.podStatus.running, colorHex: '#22C55E', icon: <CheckCircleOutline /> },
    { title: 'Deployments', value: data.deployments.length, colorHex: '#2563EB', icon: <RocketLaunch /> },
    { title: 'CPU Usage', value: '65%', colorHex: '#F59E0B', icon: <Speed /> },
    { title: 'Memory', value: '75%', colorHex: '#EF4444', icon: <Memory /> },
    { title: 'Active Alerts', value: data.alerts.length, colorHex: '#EF4444', icon: <NotificationsActive /> },
    { title: 'Pipelines', value: data.jenkinsPipelines.length, colorHex: '#3B82F6', icon: <AltRoute /> },
  ];

  return (
    <Grid container spacing={2.5}>
      {kpis.map((kpi, i) => (
        <Grid size={{ xs: 6, sm: 4, lg: 2 }} key={kpi.title}>
          <KpiWidget
            {...kpi}
            sparklineData={generateSparkline(Number(String(kpi.value).replace('%', '')) || 5, 5)}
            delay={i * 0.05}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default KpiCards;
