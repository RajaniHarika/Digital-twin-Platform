import { motion } from 'framer-motion';
import { Box, Card, CardContent, Typography, alpha } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const MetricCard = ({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue,
  color = 'primary',
  loading = false,
  subtitle,
  onClick,
  sx,
}) => {
  const colorMap = {
    primary: '#1976D2',
    success: '#2E7D32',
    warning: '#ED6C02',
    error: '#D32F2F',
    info: '#0288D1',
  };

  const bgColor = alpha(colorMap[color] || colorMap.primary, 0.08);

  if (loading) {
    return (
      <Card sx={{ height: '100%', ...sx }}>
        <CardContent>
          <Box sx={{ height: 100 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          height: '100%',
          cursor: onClick ? 'pointer' : 'default',
          bgcolor: bgColor,
          border: `1px solid ${alpha(colorMap[color] || colorMap.primary, 0.2)}`,
          ...sx,
        }}
        onClick={onClick}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight={700} color={colorMap[color]}>
                {typeof value === 'number' ? value.toLocaleString() : value}
                {unit && (
                  <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>
                    {unit}
                  </Typography>
                )}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(colorMap[color] || colorMap.primary, 0.15),
                color: colorMap[color] || colorMap.primary,
              }}
            >
              {icon}
            </Box>
          </Box>

          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {trend === 'up' ? (
                <TrendingUp sx={{ fontSize: 16, color: colorMap.success }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: colorMap.error }} />
              )}
              <Typography
                variant="body2"
                color={trend === 'up' ? 'success.main' : 'error.main'}
                fontWeight={600}
              >
                {trendValue}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                vs last period
              </Typography>
            </Box>
          )}

          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricCard;