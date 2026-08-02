import { memo } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Chip,
  Box,
  LinearProgress,
  alpha,
  useTheme,
} from '@mui/material';
import { Circle } from '@mui/icons-material';

const ServiceHealthWidget = ({ healthStatus }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={600}>
            Service Health
          </Typography>
        }
        action={
          <Chip
            label={healthStatus?.overall === 'healthy' ? 'All Systems Operational' : 'Issues Detected'}
            size="small"
            color={healthStatus?.overall === 'healthy' ? 'success' : 'warning'}
            sx={{ fontWeight: 600 }}
          />
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {healthStatus?.services.map((service) => {
            const statusColor =
              service.status === 'healthy' ? theme.palette.success.main
                : service.status === 'warning' ? theme.palette.warning.main
                  : theme.palette.error.main;
            return (
              <Box key={service.name}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Circle sx={{ fontSize: 10, color: statusColor }} />
                    <Typography variant="body2" fontWeight={500}>
                      {service.name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {service.uptime}% uptime
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={service.uptime}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha(statusColor, 0.15),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: statusColor,
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default memo(ServiceHealthWidget);
