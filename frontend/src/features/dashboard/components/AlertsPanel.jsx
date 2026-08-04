import React from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';
import EmptyState from '../../../components/EmptyState';
import { ErrorOutline, WarningAmber, InfoOutlined } from '@mui/icons-material';
import { useAppTheme } from '../../../theme/useAppTheme';

const AlertsPanel = ({ data }) => {
  const { tokens, isDark } = useAppTheme();

  const getAlertConfig = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return {
          color: '#EF4444',
          bg: isDark ? alpha('#EF4444', 0.12) : '#FEF2F2',
          icon: <ErrorOutline sx={{ color: '#EF4444', fontSize: 16 }} />,
        };
      case 'warning':
        return {
          color: '#F59E0B',
          bg: isDark ? alpha('#F59E0B', 0.12) : '#FFFBEB',
          icon: <WarningAmber sx={{ color: '#F59E0B', fontSize: 16 }} />,
        };
      case 'info':
        return {
          color: tokens.textSecondary,
          bg: isDark ? alpha(tokens.accent, 0.1) : tokens.accentLight,
          icon: <InfoOutlined sx={{ color: tokens.textSecondary, fontSize: 16 }} />,
        };
      default:
        return {
          color: tokens.textMuted,
          bg: tokens.surfaceMuted,
          icon: <InfoOutlined sx={{ color: tokens.textMuted, fontSize: 16 }} />,
        };
    }
  };

  return (
    <DashboardCard title="Active Alerts" compact noPadding>
      <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {!data?.length ? (
          <EmptyState title="No active alerts" description="All systems are operating normally." />
        ) : data.map((alert) => {
          const config = getAlertConfig(alert.severity);
          return (
            <Box
              key={alert.id}
              sx={{
                p: 1.25,
                borderRadius: '8px',
                borderLeft: `3px solid ${config.color}`,
                bgcolor: config.bg,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'flex-start', minWidth: 0 }}>
                  {config.icon}
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: tokens.text, fontWeight: 600, fontSize: '0.75rem', lineHeight: 1.3 }}>
                      {alert.title}
                    </Typography>
                    <Typography sx={{ color: tokens.textSecondary, fontSize: '0.65rem', mt: 0.2 }}>
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
