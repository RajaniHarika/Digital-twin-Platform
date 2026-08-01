import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Storage, Dns, AttachMoney, Memory } from '@mui/icons-material';
import { useAppTheme } from '../../theme/useAppTheme';

const KpiWidget = ({ title, value, subText, colorHex, icon, delay = 0, tokens }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    sx={{
      p: 2.5,
      borderRadius: `${tokens.radii.xl}px`,
      bgcolor: tokens.paper,
      border: `1px solid ${tokens.border}`,
      boxShadow: tokens.shadow,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      transition: tokens.transitions.default,
      '&:hover': { boxShadow: tokens.shadowHover },
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: `${tokens.radii.xl}px`,
        bgcolor: `${colorHex}12`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {React.cloneElement(icon, { sx: { color: colorHex, fontSize: 24 } })}
    </Box>
    <Box>
      <Typography sx={{ color: tokens.textLabel, fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </Typography>
      <Typography sx={{ color: tokens.text, fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.2 }}>
        {value}
      </Typography>
      {subText && (
        <Typography sx={{ color: colorHex, fontWeight: 600, fontSize: '0.75rem', mt: 0.5 }}>
          {subText}
        </Typography>
      )}
    </Box>
  </Box>
);

const KpiCards = ({ data }) => {
  const { tokens } = useAppTheme();
  const kpis = [
    { title: 'Total Cloud Instances', value: data.totalInstances, subText: 'Running', colorHex: tokens.textLabel, icon: <Dns /> },
    { title: 'Monthly Cloud Cost', value: `$${data.monthlySpend.toLocaleString()}`, subText: data.costTrend, colorHex: '#22C55E', icon: <AttachMoney /> },
    { title: 'Total Storage', value: data.totalStorage, subText: data.storageTrend, colorHex: tokens.textLabel, icon: <Storage /> },
    { title: 'Active Nodes', value: data.activeNodes, subText: 'Online', colorHex: '#F59E0B', icon: <Memory /> },
  ];

  return (
    <Grid container spacing={2.5}>
      {kpis.map((kpi, i) => (
        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={kpi.title}>
          <KpiWidget {...kpi} tokens={tokens} delay={i * 0.1} />
        </Grid>
      ))}
    </Grid>
  );
};

export default KpiCards;
