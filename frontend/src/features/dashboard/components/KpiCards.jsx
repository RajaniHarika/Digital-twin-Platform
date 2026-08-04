import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import {
  CheckCircleOutline, RocketLaunch, Speed, Memory, NotificationsActive, AltRoute,
} from '@mui/icons-material';
import { useAppTheme } from '../../../theme/useAppTheme';
import { scrollViewport, scrollRevealTransition } from '../../../theme/motion';

const generateSparkline = (base, volatility) =>
  Array.from({ length: 12 }).map((_, i) => ({
    val: base + Math.sin(i) * volatility + Math.random() * (volatility / 2),
  }));

const KpiWidget = ({ title, value, colorHex, icon, sparklineData, delay = 0, tokens }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={scrollViewport}
    transition={scrollRevealTransition(delay)}
    sx={{
      p: { xs: 1.75, md: 2 },
      borderRadius: `${tokens.radii.lg}px`,
      bgcolor: tokens.paper,
      border: `1px solid ${tokens.border}`,
      boxShadow: tokens.shadowSm,
      display: 'flex',
      flexDirection: 'column',
      transition: tokens.transitions.default,
      '&:hover': { transform: 'translateY(-3px)', boxShadow: tokens.shadow },
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '7px',
              bgcolor: colorHex === tokens.accent || colorHex === tokens.accentDark ? tokens.accentLight : `${colorHex}12`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {React.cloneElement(icon, { sx: { color: tokens.accentDark, fontSize: 14 } })}
          </Box>
          <Typography sx={{ color: tokens.textSecondary, fontWeight: 500, fontSize: '0.7rem', lineHeight: 1.2 }}>
            {title}
          </Typography>
        </Box>
        <Typography sx={{ color: tokens.text, fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
          {value}
        </Typography>
      </Box>
      <Box sx={{ width: 56, height: 32, flexShrink: 0 }}>
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

const KpiCards = ({ data }) => {
  const { tokens } = useAppTheme();
  const activeAlerts = (data.alerts || []).filter((alert) => alert.status === 'Active').length;
  const cpuValue = data.kpi?.cpuUsage != null ? `${Math.round(data.kpi.cpuUsage)}%` : '72%';
  const memoryValue = data.kpi?.memoryUsage != null ? `${Math.round(data.kpi.memoryUsage)}%` : '69%';

  const kpis = [
    { title: 'Pods Running', value: data.podStatus?.running ?? 0, colorHex: '#22C55E', icon: <CheckCircleOutline /> },
    { title: 'Deployments', value: data.deployments?.length ?? 0, colorHex: tokens.accent, icon: <RocketLaunch /> },
    { title: 'CPU Usage', value: cpuValue, colorHex: '#F59E0B', icon: <Speed /> },
    { title: 'Memory', value: memoryValue, colorHex: tokens.accentDark, icon: <Memory /> },
    { title: 'Active Alerts', value: activeAlerts, colorHex: '#EF4444', icon: <NotificationsActive /> },
    { title: 'Pipelines', value: data.jenkinsPipelines?.length ?? 0, colorHex: tokens.textSecondary, icon: <AltRoute /> },
  ];

  return (
    <Grid container spacing={1.5} alignItems="stretch">
      {kpis.map((kpi, i) => (
        <Grid size={{ xs: 6, sm: 4, md: 4, lg: 2 }} key={kpi.title}>
          <KpiWidget
            {...kpi}
            tokens={tokens}
            sparklineData={generateSparkline(Number(String(kpi.value).replace('%', '')) || 5, 5)}
            delay={i * 0.04}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default KpiCards;
