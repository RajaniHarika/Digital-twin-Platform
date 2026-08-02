import React from 'react';
import { Box, Typography } from '@mui/material';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';
import { ErrorOutline, WarningAmber, InfoOutlined } from '@mui/icons-material';

const AlertsPanel = ({ data }) => {
  const getAlertConfig = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return { color: '#EF4444', bg: '#FEF2F2', icon: <ErrorOutline sx={{ color: '#EF4444', fontSize: 18 }} /> };
      case 'warning':
        return { color: '#F59E0B', bg: '#FFFBEB', icon: <WarningAmber sx={{ color: '#F59E0B', fontSize: 18 }} /> };
      case 'info':
        return { color: '#3B82F6', bg: '#EFF6FF', icon: <InfoOutlined sx={{ color: '#3B82F6', fontSize: 18 }} /> };
      default:
        return { color: '#94A3B8', bg: '#F8FAFC', icon: <InfoOutlined sx={{ color: '#94A3B8', fontSize: 18 }} /> };
    }
  };

  return (
    <DashboardCard title="Active Alerts" noPadding>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {data.map((alert) => {
          const config = getAlertConfig(alert.severity);
          return (
            <Box
              key={alert.id}
              sx={{
                p: 1.5,
                borderRadius: '10px',
                borderLeft: `3px solid ${config.color}`,
                bgcolor: config.bg,
                transition: 'transform 0.15s ease',
                '&:hover': { transform: 'translateX(2px)' },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  {config.icon}
                  <Box>
                    <Typography sx={{ color: '#0F172A', fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.3 }}>
                      {alert.title}
                    </Typography>
                    <Typography sx={{ color: '#64748B', fontSize: '0.7rem', mt: 0.25 }}>
                      {alert.source} · {alert.timestamp}
                    </Typography>
                  </Box>
                </Box>
                <StatusBadge status={alert.severity} />
              </Box>
            </Box>
          );
        })}
      </Box>
    </DashboardCard>
  );
};

export default AlertsPanel;
